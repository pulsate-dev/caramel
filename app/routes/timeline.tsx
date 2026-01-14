import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { EmptyState } from "~/components/emptyState";
import { LoadMoreNoteButton } from "~/components/loadMoreNote";
import { Note } from "~/components/note";
import { PostForm } from "~/components/postForm";
import { loggedInAccount } from "~/lib/api/loggedInAccount";
import { accountCookie } from "~/lib/api/login";
import { fetchNoteById } from "~/lib/api/note";
import type { TimelineResponse } from "~/lib/api/timeline";
import { fetchHomeTimeline } from "~/lib/api/timeline";
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
    }
  | Response
> => {
  const basePath = (context.cloudflare.env as Env).API_BASE_URL;

  const cookie = await accountCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    return redirect("/login");
  }

  const query = new URL(request.url).searchParams;
  const beforeID = query.get("before_id") ?? undefined;
  const res = await fetchHomeTimeline(cookie, basePath, beforeID);
  if ("error" in res) {
    return res;
  }

  const loggedInAccountDatum = await loggedInAccount(request, basePath);
  if (!loggedInAccountDatum.isSuccess) {
    return { error: "not logged in" };
  }

  // リノートの元ノート情報を取得
  const notesWithOriginal = await Promise.all(
    res.notes.map(async (note) => {
      if (note.original_note_id) {
        const originalNote = await fetchNoteById(
          note.original_note_id,
          cookie,
          basePath
        );
        if ("error" in originalNote) {
          return note;
        }
        return {
          ...note,
          originalNote: {
            id: originalNote.id,
            content: originalNote.content,
            contents_warning_comment: originalNote.contents_warning_comment,
            author: {
              id: originalNote.author.id,
              name: originalNote.author.name,
              display_name: originalNote.author.display_name,
              avatar: originalNote.author.avatar,
            },
            reactions: originalNote.reactions,
          },
        };
      }
      return note;
    })
  );

  return {
    notes: notesWithOriginal,
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
    const isRenote = !!note.original_note_id && !!note.originalNote;

    if (isRenote) {
      return (
        <div key={note.id}>
          <Note
            id={note.id}
            author={{
              avatar: note.originalNote.author.avatar,
              name: note.originalNote.author.name,
              nickname: note.originalNote.author.display_name,
            }}
            content={note.originalNote.content}
            contentsWarningComment={note.originalNote.contents_warning_comment}
            reactions={note.originalNote.reactions.map((reaction) => ({
              emoji: reaction.emoji,
              reactedBy: reaction.reacted_by,
            }))}
            loggedInAccountID={loggedInAccountID}
            renoteInfo={{
              renoteBy: {
                avatar: note.author.avatar,
                name: note.author.name,
                nickname: note.author.display_name,
              },
              quoteComment: note.content,
            }}
          />
        </div>
      );
    }

    return (
      <div key={note.id}>
        <Note
          id={note.id}
          author={{
            avatar: note.author.avatar,
            name: note.author.name,
            nickname: note.author.display_name,
          }}
          content={note.content}
          contentsWarningComment={note.contents_warning_comment}
          reactions={note.reactions.map((reaction) => ({
            emoji: reaction.emoji,
            reactedBy: reaction.reacted_by,
          }))}
          loggedInAccountID={loggedInAccountID}
        />
      </div>
    );
  });
}
