import { Link } from "@remix-run/react";
import style from "./loadMoreNote.module.css"

export interface LoadMoreNoteButtonProps {
  type: "newer" | "older";
  noteID: string;
}

export const LoadMoreNoteButton = (props: LoadMoreNoteButtonProps) => {
  if (props.type === "newer") {
    return (
      <>
        <Link to={`?after_id=${props.noteID}#`} className={style.loadMoreNote}>
          <div>
            <p>Load newer notes</p>
          </div>
        </Link>
      </>
    );
  } else {
    return (
      <>
        <Link to={`?before_id=${props.noteID}#`}  className={style.loadMoreNote}>
          <div>
            <p>Load older notes</p>
          </div>
        </Link>
      </>
    );
  }
};
