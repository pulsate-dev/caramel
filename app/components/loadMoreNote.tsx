import { TimelineButton } from "~/components/timelineButton";

import style from "./loadMoreNote.module.css";

export interface LoadMoreNoteButtonProps {
  type: "newer" | "older";
  noteID: string;
  timeline?: "home" | "public";
}

export const LoadMoreNoteButton = (props: LoadMoreNoteButtonProps) => {
  const createLink = (params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();

    if (props.timeline) {
      query.set("timeline", props.timeline);
    }
    for (const [name, value] of Object.entries(params)) {
      if (value) query.set(name, value);
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}#` : "?#";
  };

  if (props.type === "newer") {
    return (
      <div className={style.loadMoreNote}>
        <TimelineButton
          link={createLink({ after_id: props.noteID })}
          linkText="Load newer notes"
        />
      </div>
    );
  } else if (props.type === "older") {
    return (
      <div className={style.loadMoreNote}>
        <TimelineButton
          link={createLink({ before_id: props.noteID })}
          linkText="Load older notes"
        />
      </div>
    );
  } else {
    throw new Error("Invalid props");
  }
};
