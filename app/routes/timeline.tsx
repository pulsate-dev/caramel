import type {
  LoaderFunctionArgs,
  MetaFunction} from "react-router";
import {
  redirect,
  useLoaderData,
} from "react-router";
import { EmptyState } from "~/components/emptyState";
import { LoadMoreNoteButton } from "~/components/loadMoreNote";
import { Note } from "~/components/note";
import { PostForm } from "~/components/postForm";
import { loggedInAccount } from "~/lib/loggedInAccount";
import { accountCookie } from "~/lib/login";
import type { TimelineResponse } from "~/lib/timeline";
import { fetchHomeTimeline } from "~/lib/timeline";
import styles from "~/styles/timeline.module.css";

export const meta: MetaFunction = () => {
  return [{ title: "Timeline | Caramel" }, { content: "noindex" }];
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<
  | { error: string }
  | {
      notes: TimelineResponse[];
      loggedInAccountID: string;
    }
  | Response
> => {
  const cookie = await accountCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    return redirect("/login");
  }

  const query = new URL(request.url).searchParams;
  const beforeID = query.get("before_id") ?? undefined;
  const res = await fetchHomeTimeline(cookie, beforeID);
  if ("error" in res) {
    return res;
  }

  const loggedInAccountDatum = await loggedInAccount(request);
  if (!loggedInAccountDatum.isSuccess) {
    return { error: "not logged in" };
  }

  return {
    notes: res.notes,
    loggedInAccountID: loggedInAccountDatum.response.id,
  };
};

export default function Timeline() {
  const loaderData = useLoaderData<typeof loader>();
  if ("error" in loaderData) {
    return <div>{loaderData.error}</div>;
  }

  return (
    <div className={styles.noteContainer}>
      <PostForm />

      {loaderData.notes.length === 0 ? (
        <EmptyState emoji="💭">
          <h3>No notes here</h3>
          <p>
            Notes from accounts you follow will appear here.
            <wbr />
            Your notes will also appear here.
          </p>
        </EmptyState>
      ) : (
        <>
          <LoadMoreNoteButton type="newer" noteID={loaderData.notes[0].id} />

          {loaderData && (
            <TimelineNotes
              notes={loaderData.notes}
              loggedInAccountID={loaderData.loggedInAccountID}
            />
          )}
        </>
      )}

      {loaderData.notes.length > 20 && (
        <LoadMoreNoteButton type="older" noteID={loaderData.notes.at(-1)!.id} />
      )}
    </div>
  );
}

function TimelineNotes({
  notes,
  loggedInAccountID,
}: {
  notes: TimelineResponse[];
  loggedInAccountID: string;
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
    return (
      <div key={note.id}>
        <Note
          id={note.id}
          author={author}
          content={note.content}
          contentsWarningComment={note.contents_warning_comment}
          reactions={reactions}
          loggedInAccountID={loggedInAccountID}
        />
      </div>
    );
  });
}
