import { useFetcher } from "@remix-run/react";
import { useState } from "react";
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

  /**
   * Handle reaction
   * @return {boolean} if true, reaction is success.
   * @param emoji
   */
  const handleReaction = async (emoji: string): Promise<boolean> => {
    fetcher.submit(
      { emoji, noteID: id },
      { method: "post", action: "/api/reaction" }
    );
    return !fetcher.data;
  };

  const handleUndoReaction = async (): Promise<boolean> => {
    fetcher.submit(
      { noteID: id },
      { method: "delete", action: "/api/reaction" }
    );
    return !fetcher.data;
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
            setIsReacted(!(await handleUndoReaction()));
          } else {
            setIsReacted(await handleReaction("👍"));
          }
        }}
      >
        👍 {reactions.length}{" "}
        {isReacted ? <span>(reacted)</span> : <span></span>}
      </button>
    </div>
  );
};
