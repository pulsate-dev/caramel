import { useAtom } from "jotai/index";
import {
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useLoaderData,
} from "react-router";
import { LoadMoreNoteButton } from "~/components/loadMoreNote";
import { Note } from "~/components/note";
import { PostForm } from "~/components/postForm";
import { readonlyLoggedInAccountAtom } from "~/lib/atoms/loggedInAccount";
import { accountCookie } from "~/lib/login";
import { fetchHomeTimeline, TimelineResponse } from "~/lib/timeline";
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

  return {
    notes: res.notes,
  };
};

export default function Timeline() {
  const loaderData = useLoaderData<typeof loader>();
  if ("error" in loaderData) {
    return <div>{loaderData.error}</div>;
  }

  const [loggedInAccount] = useAtom(readonlyLoggedInAccountAtom);
  if (!loggedInAccount) {
    // ToDo: ログイン後に/timelineに戻ってこれるようにする (cf. #300)
    return redirect("/login");
  }

  return (
    <div className={styles.noteContainer}>
      <PostForm />

      <LoadMoreNoteButton type="newer" noteID={loaderData.notes[0].id} />

      {loaderData ? (
        loaderData.notes.map((note) => {
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
                loggedInAccountID={loggedInAccount.id}
              />
            </div>
          );
        })
      ) : (
        <div></div>
      )}

      {loaderData.notes.length > 20 && (
        <LoadMoreNoteButton type="older" noteID={loaderData.notes.at(-1)!.id} />
      )}
    </div>
  );
}
