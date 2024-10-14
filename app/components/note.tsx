import styles from "~/components/note.module.css";

export interface NoteProps {
  content: string;
  contentsWarningComment: string;
  author: {
    avatar: string;
    name: string;
    nickname: string;
  };
}

export const Note = ({
  content,
  contentsWarningComment,
  author,
}: NoteProps) => {
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
    </div>
  );
};
