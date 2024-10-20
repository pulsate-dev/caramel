import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import styles from "~/components/note.module.css";
import { action } from "~/routes/api.reaction";

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
        if (fetcher.formMethod === "post") setIsReacted(false);
        if (fetcher.formMethod === "delete") setIsReacted(true);
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
      <div className={styles.accountNameContainer}>
        <h2>
          {author.nickname}
          <span>{author.name}</span>
        </h2>
      </div>
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
