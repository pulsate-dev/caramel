import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data, Form, redirect, useLoaderData, useSubmit } from "react-router";

import { EmptyState } from "~/components/emptyState";
import { LoadMoreNoteButton } from "~/components/loadMoreNote";
import { Note } from "~/components/note";
import { PostForm } from "~/components/postForm";
import { loggedInAccount } from "~/lib/api/loggedInAccount";
import { accountCookie } from "~/lib/api/login";
import { fetchNote } from "~/lib/api/note";
import type { TimelineResponse, TimelineType } from "~/lib/api/timeline";
import { fetchTimeline } from "~/lib/api/timeline";
import { cloudflareContext } from "~/lib/cloudflareContext";

import styles from "~/styles/timeline.module.css";

export const meta: MetaFunction = () => {
  return [{ title: "Timeline | Caramel" }, { content: "noindex" }];
};

export const loader = async ({
  request,
  context,
}: LoaderFunctionArgs): Promise<
  | { error: string }
  | {
      notes: TimelineResponse[];
      loggedInAccountID: string;
      originalNotes: TimelineResponse[];
      timeline: TimelineType;
    }
  | Response
> => {
  const basePath = context.get(cloudflareContext).env.API_BASE_URL;

  const cookie = await accountCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    return redirect("/login");
  }

  const query = new URL(request.url).searchParams;
  const timeline: TimelineType =
    query.get("timeline") === "public" ? "public" : "home";
  const beforeID = query.get("before_id") ?? undefined;
  const afterID = query.get("after_id") ?? undefined;
  if (beforeID && afterID) {
    throw data("before_id and after_id cannot be used together", {
      status: 400,
    });
  }
  const res = await fetchTimeline(
    cookie,
    basePath,
    timeline,
    beforeID,
    afterID
  );
  if ("error" in res) {
    return res;
  }

  const loggedInAccountDatum = await loggedInAccount(request, basePath);
  if (!loggedInAccountDatum.isSuccess) {
    return { error: "not logged in" };
  }

  const renoteNotes = res.notes.filter((n) => n.original_note_id);
  const originalNotes: TimelineResponse[] = [];
  if (renoteNotes.length > 0) {
    const results = await Promise.all(
      renoteNotes.map((n) => fetchNote(cookie, basePath, n.original_note_id!))
    );
    for (const result of results) {
      if (!("error" in result)) {
        originalNotes.push(result);
      }
    }
  }

  return {
    notes: res.notes,
    loggedInAccountID: loggedInAccountDatum.response.id,
    originalNotes,
    timeline,
  };
};

export default function Timeline() {
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();
  if ("error" in loaderData) {
    return <div>{loaderData.error}</div>;
  }

  const emptyStateDescription =
    loaderData.timeline === "public"
      ? "Public notes will appear here."
      : "Notes from accounts you follow will appear here. Your notes will also appear here.";

  return (
    <div className={styles.noteContainer}>
      <div>
        <Form method="get">
          <label htmlFor="timeline">
            <select
              id="timeline"
              name="timeline"
              value={loaderData.timeline}
              onChange={(event) => submit(event.currentTarget.form)}
            >
              <option value="home">Home</option>
              <option value="public">Public</option>
            </select>
          </label>
        </Form>
        <PostForm />
      </div>

      {loaderData.notes.length === 0 ? (
        <EmptyState emoji="💭">
          <h3>No notes here</h3>
          <p>{emptyStateDescription}</p>
        </EmptyState>
      ) : (
        <>
          <LoadMoreNoteButton
            type="newer"
            noteID={loaderData.notes[0].id}
            timeline={loaderData.timeline}
          />

          {loaderData && (
            <TimelineNotes
              notes={loaderData.notes}
              loggedInAccountID={loaderData.loggedInAccountID}
              originalNotes={loaderData.originalNotes}
            />
          )}
        </>
      )}

      {loaderData.notes.length >= 20 && (
        <LoadMoreNoteButton
          type="older"
          noteID={loaderData.notes.at(-1)!.id}
          timeline={loaderData.timeline}
        />
      )}
    </div>
  );
}

function TimelineNotes({
  notes,
  loggedInAccountID,
  originalNotes,
}: {
  notes: TimelineResponse[];
  loggedInAccountID: string;
  originalNotes: TimelineResponse[];
}) {
  return notes.map((note) => {
    const author = {
      avatar: note.author.avatar,
      name: note.author.name,
      nickname: note.author.display_name,
    };
    const reactions = note.reactions.map((reaction) => ({
      emoji: reaction.emoji,
      reactedBy: reaction.reacted_by,
    }));

    const originalNote =
      note.original_note_id &&
      originalNotes.find((n) => n.id === note.original_note_id);
    const renoteInfo = originalNote
      ? {
          renoteBy: author,
          originalAuthor: {
            avatar: originalNote.author.avatar,
            name: originalNote.author.name,
            nickname: originalNote.author.display_name,
          },
          originalContent: originalNote.content,
          originalCWComment: originalNote.contents_warning_comment,
        }
      : undefined;

    return (
      <div key={note.id}>
        <Note
          id={note.id}
          author={author}
          content={note.content}
          contentsWarningComment={note.contents_warning_comment}
          reactions={reactions}
          loggedInAccountID={loggedInAccountID}
          renoteInfo={renoteInfo}
        />
      </div>
    );
  });
}
