import {
  LoaderFunctionArgs,
  redirect,
  TypedResponse,
} from "@remix-run/cloudflare";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { LoadMoreNoteButton } from "~/components/loadMoreNote";
import { Note } from "~/components/note";
import { PostForm } from "~/components/postForm";
import { accountCookie } from "~/lib/login";
import { parseToken, TokenPayload } from "~/lib/parseToken";
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
      loggedInAccount: TokenPayload;
    }
  | TypedResponse<never>
> => {
  const cookie = await accountCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    return redirect("/login");
  }
  const parsedToken = parseToken(cookie);
  if (parsedToken instanceof Error) {
    return { error: parsedToken.message };
  }

  const query = new URL(request.url).searchParams;
  const beforeID = query.get("before_id") ?? undefined;
  const res = await fetchHomeTimeline(cookie, beforeID);
  if ("error" in res) {
    return res;
  }

  return {
    notes: res.notes,
    loggedInAccount: parsedToken,
  };
};

export default function Timeline() {
  const loaderData = useLoaderData<typeof loader>();
  if ("error" in loaderData) {
    return <div>{loaderData.error}</div>;
  }
  if (!("name" in loaderData.loggedInAccount)) {
    return <div>Invalid token</div>;
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
                loggedInAccountID={loaderData.loggedInAccount.id}
              />
            </div>
          );
        })
      ) : (
        <div></div>
      )}

      {loaderData.notes.length < 20 ? (
        <></>
      ) : (
        <LoadMoreNoteButton type="older" noteID={loaderData.notes.at(-1)!.id} />
      )}
    </div>
  );
}
