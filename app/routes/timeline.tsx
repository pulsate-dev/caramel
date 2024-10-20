import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { Note } from "~/components/note";
import { accountCookie } from "~/lib/login";
import { fetchHomeTimeline } from "~/lib/timeline";
import styles from "~/styles/timeline.module.css";
import { parseToken, TokenPayload } from "~/lib/parseToken";

export const meta: MetaFunction = () => {
  return [{ title: "Timeline | Caramel" }, { content: "noindex" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = await accountCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    return redirect("/login");
  }

  const res = await fetchHomeTimeline(cookie);
  if ("error" in res) {
    return res;
  }

  return {
    notes: res.notes,
    loggedInAccount: parseToken(cookie),
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
            <Note
              key={note.id}
              id={note.id}
              author={author}
              content={note.content}
              contentsWarningComment={note.contents_warning_comment}
              reactions={reactions}
              loggedInAccountID={(loaderData.loggedInAccount as TokenPayload).id}
            />
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}
