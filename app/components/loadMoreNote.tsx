import { TimelineButton } from "~/components/timelineButton";
import style from "./loadMoreNote.module.css";

export interface LoadMoreNoteButtonProps {
  type: "newer" | "older";
  noteID: string;
}

export const LoadMoreNoteButton = (props: LoadMoreNoteButtonProps) => {
  if (props.type === "newer") {
    return (
      <div className={style.loadMoreNote}>
        <TimelineButton
          link={`?after_id=${props.noteID}#`}
          linkText="Load newer notes"
        />
      </div>
    );
  } else {
    return (
      <div className={style.loadMoreNote}>
        <TimelineButton
          link={`?before_id=${props.noteID}#`}
          linkText="Load older notes"
        />
      </div>
    );
  }
};
