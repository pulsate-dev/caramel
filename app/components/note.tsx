import { useState } from "react";
import styles from "~/components/note.module.css";
import { useLoggedInAccount } from "~/hooks/accountData";

export interface NoteProps {
  id: string;
  content: string;
  contentsWarningComment: string;
  reactions: { emoji: string; reactedBy: string }[];
  author: {
    avatar: string;
    name: string;
    nickname: string;
  };
}

export const Note = ({
  id,
  content,
  contentsWarningComment,
  author,
  reactions,
}: NoteProps) => {
  const [isReacted, setIsReacted] = useState(false);
  // const loggedInAccountContext = useLoggedInAccount();

  // リアクションの配列に自分のIDが含まれていたらリアクション済みとする
  // if (!reactions.find(r => r.reactedBy === loggedInAccountContext.id)) {
  //   setIsReacted(true);
  // }
  // console.log(loggedInAccountContext);
  // console.log(
  //   reactions.find((r) => r.reactedBy === loggedInAccountContext.account.id)
  // );

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
          if (isReacted) return;
          try {
            const res = await fetch(
              `http://localhost:3000/notes/${id}/reaction`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ emoji: "👍" }),
              }
            );
            setIsReacted(res.ok);
          } catch (e) {
            console.error(e);
            setIsReacted(false);
          }
        }}
      >
        👍 x {reactions.length} {isReacted ? "Reacted" : "React"}
      </button>
    </div>
  );
};
