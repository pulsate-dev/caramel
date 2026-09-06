import type { NoteProps } from "~/components/note.types";
import { NoteActions } from "~/components/noteActions";
import { NoteAuthor } from "~/components/noteAuthor";
import { NoteContent } from "~/components/noteContent";

import styles from "~/components/note.module.css";

export type { NoteProps } from "~/components/note.types";

export const Note = ({
  id,
  content,
  contentsWarningComment,
  author,
  reactions,
  loggedInAccountID,
  renoteInfo,
}: NoteProps) => {
  const displayAuthor = renoteInfo ? renoteInfo.originalAuthor : author;
  const displayContent = renoteInfo ? renoteInfo.originalContent : content;
  const displayCWComment = renoteInfo
    ? renoteInfo.originalCWComment
    : contentsWarningComment;

  return (
    <div className={styles.note}>
      {renoteInfo && (
        <div className={styles.renoteHeader}>
          <span>
            <bdi>{renoteInfo.renoteBy.nickname}</bdi> がリノートしました
          </span>
        </div>
      )}
      <NoteAuthor author={displayAuthor} />
      <NoteContent
        contentsWarningComment={displayCWComment}
        content={displayContent}
      />
      <NoteActions
        noteId={id}
        reactions={reactions}
        loggedInAccountID={loggedInAccountID}
      />
    </div>
  );
};
