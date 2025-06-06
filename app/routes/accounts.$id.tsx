import {
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useParams,
} from "react-router";
import { LoadMoreNoteButton } from "~/components/loadMoreNote";
import { Note, NoteProps } from "~/components/note";
import { account, AccountResponse, accountTimeline } from "~/lib/account";
import { loggedInAccount } from "~/lib/loggedInAccount";
import { accountCookie } from "~/lib/login";
import { TimelineResponse } from "~/lib/timeline";
import styles from "~/styles/account.module.css";

export const loader = async ({
  request,
  params,
}: LoaderFunctionArgs): Promise<
  | { error: string }
  | {
      error: undefined;
      account: AccountResponse;
      timeline: TimelineResponse[];
      loggedInAccountID: string;
    }
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

  const query = new URL(request.url).searchParams;
  const beforeID = query.get("before_id") ?? undefined;
  const afterID = query.get("after_id") ?? undefined;
  if (beforeID && afterID) {
    throw new Error("before_id and after_id cannot be used together");
  }

  const timelineRes = await accountTimeline(accountRes.id, token, beforeID);
  if ("error" in timelineRes) {
    return { error: timelineRes.error };
  }

  const loggedInAccountDatum = await loggedInAccount(request);
  if (!loggedInAccountDatum.isSuccess) {
    return { error: "not logged in" };
  }

  return {
    error: undefined,
    account: accountRes,
    timeline: timelineRes,
    loggedInAccountID: loggedInAccountDatum.response.id,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Account | Caramel" }, { content: "noindex" }];
  }
  if (data.error !== undefined) {
    return [{ title: "Account | Caramel" }, { content: "noindex" }];
  }

  return [
    { title: `${data.account.nickname} (${data.account.name}) | Caramel` },
    { content: "noindex" },
  ];
};

export default function Account() {
  const data = useLoaderData<typeof loader>();
  if (data.error !== undefined) {
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
      loggedInAccountID: data.loggedInAccountID ?? "",
    })
  );
  const params = useParams();
  const isThisAccountSelf = !!params.id && params.id === loggedInAccount?.name;

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

      {timelineNotes.length === 0 ? (
        // NOTE: paramsで指定されたアカウントが空である場合は404が表示されるので，ここではnon-null assertionを使う
        <EmptyAccountTimeline
          accountName={params.id!}
          isThisAccountSelf={isThisAccountSelf}
        />
      ) : (
        <AccountTimeline notes={timelineNotes} />
      )}
    </>
  );
}

interface AccountTimelineProps {
  notes: readonly NoteProps[];
}

const AccountTimeline = ({ notes }: AccountTimelineProps) => {
  return (
    <div>
      <div>
        <LoadMoreNoteButton type="newer" noteID={notes[0].id} />
      </div>

      {notes.map((note) => {
        return <Note key={note.id} {...note} />;
      })}

      <div>
        {notes.length < 20 ? (
          <></>
        ) : (
          <LoadMoreNoteButton type="older" noteID={notes.at(-1)!.id} />
        )}
      </div>
    </div>
  );
};

const EmptyAccountTimeline = ({
  accountName,
  isThisAccountSelf,
}: {
  accountName: string;
  isThisAccountSelf: boolean;
}) => {
  return (
    <div className={styles.emptyState}>
      <span>💭</span>
      <h3>No notes yet</h3>
      <p>
        {isThisAccountSelf
          ? "Your notes will appear here when you post them."
          : `${accountName} hasn&#39;t made any notes yet.`}
      </p>
    </div>
  );
};
