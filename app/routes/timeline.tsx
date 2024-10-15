import { MetaFunction } from "@remix-run/react";
import { Note } from "~/components/note";
import { useHomeTimeline } from "~/hooks/timeline";
import styles from "~/styles/timeline.module.css";

export const meta: MetaFunction = () => {
  return [{ title: "Timeline | Caramel" }, { content: "noindex" }];
};

export default function Timeline() {
  const { notes, error } = useHomeTimeline();

  return (
    <div className={styles.noteContainer}>
      {notes ? (
        notes.map((note) => {
          const author = {
            avatar: note.author.avatar,
            name: note.author.name,
            nickname: note.author.display_name,
          };
          return (
            <Note
              key={note.id}
              id={note.id}
              author={author}
              content={note.content}
              contentsWarningComment={note.contents_warning_comment}
              reactions={note.reactions.map((reaction) => ({
                emoji: reaction.emoji,
                reactedBy: reaction.reacted_by,
              }))}
            />
          );
        })
      ) : (
        <div>{error}</div>
      )}
    </div>
  );
}
