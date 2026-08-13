import { TimelineButton } from "~/components/timelineButton";

import style from "./loadMoreNote.module.css";

export interface LoadMoreNoteButtonProps {
  type: "newer" | "older";
  noteID: string;
  timeline?: "home" | "public";
  beforeIDs?: string[];
}

export const LoadMoreNoteButton = (props: LoadMoreNoteButtonProps) => {
  const createLink = (params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();

    if (props.timeline) {
      query.set("timeline", props.timeline);
      if (props.beforeIDs?.length) {
        query.set("before_ids", props.beforeIDs.join(","));
      }
    }
    for (const [name, value] of Object.entries(params)) {
      if (value) query.set(name, value);
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}#` : "?#";
  };

  if (props.type === "newer") {
    if (props.timeline) {
      const beforeIDs = props.beforeIDs ?? [];
      const previousBeforeID = beforeIDs.at(-1);

      return (
        <div className={style.loadMoreNote}>
          <TimelineButton
            link={createLink({ before_id: previousBeforeID })}
            linkText="Load newer notes"
          />
        </div>
      );
    }

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
