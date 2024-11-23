import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { Note, NoteProps } from "~/components/note";
import { account, AccountResponse, accountTimeline } from "~/lib/account";
import { accountCookie } from "~/lib/login";
import { TimelineResponse } from "~/lib/timeline";
import styles from "~/styles/account.module.css";

export const loader = async ({
  request,
  params,
}: LoaderFunctionArgs): Promise<
  { error: string } | { account: AccountResponse; timeline: TimelineResponse[] }
> => {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { error: "not logged in" };
  }
  if (!params.id) return { error: "invalid id" };

  const accountRes = await account(params.id, token);
  if ("error" in accountRes) {
    return { error: accountRes.error };
  }

  const timelineRes = await accountTimeline(accountRes.id, token);
  if ("error" in timelineRes) {
    return { error: timelineRes.error };
  }

  return { account: accountRes, timeline: timelineRes };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Account | Caramel" }, { content: "noindex" }];
  }
  if ("error" in data) {
    return [{ title: "Account | Caramel" }, { content: "noindex" }];
  }

  return [
    { title: `${data.account.nickname} (${data.account.name}) | Caramel` },
    { content: "noindex" },
  ];
};

export default function Account() {
  const data = useLoaderData<typeof loader>();
  if ("error" in data) {
    return <div>{data.error}</div>;
  }

  const timelineNotes = data.timeline.map(
    (note): NoteProps => ({
      id: note.id,
      content: note.content,
      contentsWarningComment: note.contents_warning_comment,
      author: {
        avatar: note.author.avatar,
        name: note.author.name,
        nickname: note.author.display_name,
      },
      reactions: note.reactions.map((reaction) => ({
        emoji: reaction.emoji,
        reactedBy: reaction.reacted_by,
      })),
      loggedInAccountID: data.account.id,
    })
  );

  return (
    <>
      <div className={styles.accountData}>
        <div>
          <img
            className={styles.avatarImage}
            src={data.account.avatar}
            alt={`${data.account.nickname}'s avatar image`}
            loading={"lazy"}
          />
        </div>
        <h1>
          {data.account.nickname} <span>{data.account.name}</span>
        </h1>
        <p>{data.account.bio}</p>
        <div>
          <p>
            <span>{data.account.following_count}</span> following
            <span>{data.account.followed_count}</span> followers
          </p>
        </div>
      </div>

      <AccountTimeline notes={timelineNotes} />
    </>
  );
}

interface AccountTimelineProps {
  notes: readonly NoteProps[];
}

const AccountTimeline = ({ notes }: AccountTimelineProps) => {
  return (
    <div>
      {notes.map((note) => {
        return <Note key={note.id} {...note} />;
      })}
    </div>
  );
};
