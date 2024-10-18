import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { Note } from "~/components/note";
import { accountCookie } from "~/lib/login";
import { fetchHomeTimeline } from "~/lib/timeline";
import styles from "~/styles/timeline.module.css";
export const meta: MetaFunction = () => {
  return [{ title: "Timeline | Caramel" }, { content: "noindex" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = await accountCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    return redirect("/login");
  }

  return await fetchHomeTimeline(cookie);
};

export default function Timeline() {
  const loaderData = useLoaderData<typeof loader>();
  if ("error" in loaderData) {
    return <div>{loaderData.error}</div>;
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
          return (
            <Note
              key={note.id}
              author={author}
              content={note.content}
              contentsWarningComment={note.contents_warning_comment}
            />
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}
