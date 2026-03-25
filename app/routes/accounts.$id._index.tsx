import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { EmptyState } from "~/components/emptyState";
import { FollowButton } from "~/components/followButton";
import { LoadMoreNoteButton } from "~/components/loadMoreNote";
import type { NoteProps } from "~/components/note";
import { Note } from "~/components/note";
import type { AccountResponse } from "~/lib/account";
import { account, accountTimeline } from "~/lib/account";
import { getToken } from "~/lib/api/getToken";
import { loggedInAccount } from "~/lib/api/loggedInAccount";
import { fetchNote } from "~/lib/api/note";
import {
  accountRelationship,
  type AccountRelationshipResponse,
} from "~/lib/api/relationship";
import type { TimelineResponse } from "~/lib/api/timeline";
import { defaultAccountAvatar } from "~/lib/defaultAccountImage";
import styles from "~/styles/account.module.css";

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs): Promise<
  | { error: string }
  | {
      error: undefined;
      account: AccountResponse;
      timeline: TimelineResponse[];
      loggedInAccountID: string;
      relationships: AccountRelationshipResponse;
      originalNotes: TimelineResponse[];
    }
> => {
  const basePath = (context.cloudflare.env as Env).API_BASE_URL;

  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return { error: "not logged in" };
  }
  const token = isLoggedIn.token;

  if (!params.id) return { error: "invalid id" };

  const accountRes = await account(params.id, token, basePath);
  if ("error" in accountRes) {
    return { error: accountRes.error };
  }

  const query = new URL(request.url).searchParams;
  const beforeID = query.get("before_id") ?? undefined;
  const afterID = query.get("after_id") ?? undefined;
  if (beforeID && afterID) {
    throw new Error("before_id and after_id cannot be used together");
  }

  const timelineRes = await accountTimeline(
    accountRes.id,
    token,
    basePath,
    beforeID
  );
  if ("error" in timelineRes) {
    return { error: timelineRes.error };
  }

  const loggedInAccountDatum = await loggedInAccount(request, basePath);
  if (!loggedInAccountDatum.isSuccess) {
    return { error: "not logged in" };
  }

  const relationshipRes = await accountRelationship(
    basePath,
    token,
    accountRes.id
  );
  if (!relationshipRes.isSuccess) {
    return { error: "failed to fetch relationship" };
  }

  const renoteNotes = timelineRes.filter((n) => n.original_note_id);
  const originalNotes: TimelineResponse[] = [];
  if (renoteNotes.length > 0) {
    const results = await Promise.all(
      renoteNotes.map((n) => fetchNote(token, basePath, n.original_note_id!))
    );
    for (const result of results) {
      if (!("error" in result)) {
        originalNotes.push(result);
      }
    }
  }

  return {
    error: undefined,
    account: accountRes,
    timeline: timelineRes,
    loggedInAccountID: loggedInAccountDatum.response.id,
    relationships: relationshipRes.response,
    originalNotes,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Account | Caramel" }, { content: "noindex" }];
  }
  if (data.error !== undefined) {
    return [{ title: "Account | Caramel" }, { content: "noindex" }];
  }

  // ToDo: アカウントが外部アカウントである場合はnoindexを設定する (v0.1.0以降に対応する)
  return [
    { title: `${data.account.nickname} (${data.account.name}) | Caramel` },
  ];
};

export default function Account() {
  const data = useLoaderData<typeof loader>();
  if (data.error !== undefined) {
    return <div>{data.error}</div>;
  }

  const timelineNotes = data.timeline.map((note): NoteProps => {
    const author = {
      avatar: note.author.avatar,
      name: note.author.name,
      nickname: note.author.display_name,
    };

    const originalNote =
      note.original_note_id &&
      data.originalNotes.find((n) => n.id === note.original_note_id);
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

    return {
      id: note.id,
      content: note.content,
      contentsWarningComment: note.contents_warning_comment,
      author,
      reactions: note.reactions.map((reaction) => ({
        emoji: reaction.emoji,
        reactedBy: reaction.reacted_by,
      })),
      loggedInAccountID: data.loggedInAccountID ?? "",
      renoteInfo,
    };
  });

  const isThisAccountSelf = data.account.id === data.loggedInAccountID;
  return (
    <>
      <div className={styles.accountData}>
        <div>
          <img
            className={styles.avatarImage}
            src={defaultAccountAvatar(data.account.avatar)}
            alt={`${data.account.nickname}'s avatar image`}
            loading={"lazy"}
          />
        </div>
        <h1 className={styles.accountName}>
          {data.account.nickname} <span>{data.account.name}</span>
        </h1>

        {!isThisAccountSelf && (
          <FollowButton
            accountName={data.account.name}
            relationship={data.relationships}
          />
        )}

        {isThisAccountSelf && (
          <a href={`/accounts/${data.account.name}/edit`}>
            <button type="button">Edit Profile</button>
          </a>
        )}

        <p>{data.account.bio}</p>
        <div>
          <p>
            <a href={`/accounts/${data.account.name}/following`}>
              {data.account.following_count} following
            </a>
            {" | "}
            <a href={`/accounts/${data.account.name}/follower`}>
              {data.account.followed_count} followers
            </a>
          </p>
        </div>
      </div>

      {timelineNotes.length === 0 ? (
        // NOTE: paramsで指定されたアカウントが空である場合は404が表示されるので，ここではnon-null assertionを使う
        <EmptyState emoji="💭">
          <h3>No notes yet</h3>
          <p>
            {isThisAccountSelf
              ? "Your notes will appear here when you post them."
              : `${data.account.name} hasn&#39;t made any notes yet.`}
          </p>
        </EmptyState>
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
        {notes.length >= 20 && (
          <LoadMoreNoteButton type="older" noteID={notes.at(-1)!.id} />
        )}
      </div>
    </div>
  );
};
