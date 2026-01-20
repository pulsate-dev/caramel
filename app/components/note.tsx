import { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import styles from "~/components/note.module.css";
import { defaultAccountAvatar } from "~/lib/defaultAccountImage";
import type { action } from "~/routes/api.reaction";

export interface NoteProps {
  id: string;
  content: string;
  contentsWarningComment: string;
  author: {
    avatar: string;
    name: string;
    nickname: string;
  };
  reactions: {
    emoji: string;
    reactedBy: string;
  }[];
  loggedInAccountID: string;
}

export const Note = ({
  id,
  content,
  contentsWarningComment,
  author,
  reactions,
  loggedInAccountID,
}: NoteProps) => {
  const fetcher = useFetcher<typeof action>();
  const [isReacted, setIsReacted] = useState(
    reactions.some((reaction) => reaction.reactedBy === loggedInAccountID)
  );

  // NOTE: Reaction fetcher error handing here
  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.state === "loading") {
      if ("error" in fetcher.data) {
        if (fetcher.formMethod === "POST") setIsReacted(false);
        if (fetcher.formMethod === "DELETE") setIsReacted(true);
      }
    }
  }, [fetcher.state]);

  /**
   * Handle reaction
   */
  const handleReaction = (emoji: string) => {
    setIsReacted(true);
    fetcher.submit(
      { emoji, noteID: id },
      { method: "post", action: "/api/reaction" }
    );
  };

  /**
   * Handle undo reaction
   */
  const handleUndoReaction = () => {
    setIsReacted(false);
    fetcher.submit(
      { noteID: id },
      { method: "delete", action: "/api/reaction" }
    );
  };

  return (
    <div className={styles.note}>
      <Link to={`/accounts/${author.name}`}>
        <div className={styles.accountNameContainer}>
          <div className={styles.avatarImageContainer}>
            <img
              src={defaultAccountAvatar(author.avatar)}
              alt={`${author.nickname}'s avatar`}
              loading="lazy"
            />
          </div>
          <h2>
            <bdi>{author.nickname}</bdi>
            <span>@{author.name.split("@")[1]}</span>
          </h2>
        </div>
      </Link>
      {contentsWarningComment.length !== 0 ? (
        <details>
          <summary>{contentsWarningComment}</summary>
          <p>{content}</p>
        </details>
      ) : (
        <p>{content}</p>
      )}
      <button
        onClick={async () => {
          if (isReacted) {
            handleUndoReaction();
          } else {
            handleReaction("👍");
          }
        }}
      >
        👍 {reactions.length}{" "}
        {isReacted ? <span>(reacted)</span> : <span></span>}
      </button>
    </div>
  );
};
