import { LoadMoreNoteButton } from "~/components/loadMoreNote";
import { Note, toNoteProps } from "~/components/note";
import type { TimelineResponse, TimelineType } from "~/lib/api/timeline";

export interface NoteTimelineProps {
  notes: readonly TimelineResponse[];
  originalNotes: readonly TimelineResponse[];
  loggedInAccountID: string;
  timeline?: TimelineType;
}

export const NoteTimeline = ({
  notes,
  originalNotes,
  loggedInAccountID,
  timeline,
}: NoteTimelineProps) => {
  if (notes.length === 0) {
    return null;
  }

  const noteProps = notes.map((note) =>
    toNoteProps(note, loggedInAccountID, originalNotes)
  );

  return (
    <div>
      <LoadMoreNoteButton
        type="newer"
        noteID={notes[0].id}
        timeline={timeline}
      />

      {noteProps.map((note) => (
        <Note key={note.id} {...note} />
      ))}

      {notes.length >= 20 && (
        <LoadMoreNoteButton
          type="older"
          noteID={notes.at(-1)!.id}
          timeline={timeline}
        />
      )}
    </div>
  );
};
