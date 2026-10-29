import type { NoteProps } from "~/components/note.types";
import type { TimelineResponse } from "~/lib/api/timeline";

export function toNoteProps(
  note: TimelineResponse,
  originalNotes: readonly TimelineResponse[],
  loggedInAccountID: string
): NoteProps {
  const author = {
    avatar: note.author.avatar,
    name: note.author.name,
    nickname: note.author.display_name,
  };

  const originalNote =
    note.original_note_id &&
    originalNotes.find((n) => n.id === note.original_note_id);
  const renoteInfo = originalNote
    ? {
        renoteBy: author,
        originalAuthor: {
          avatar: originalNote.author.avatar,
          name: originalNote.author.name,
          nickname: originalNote.author.display_name,
        },
        originalContent: originalNote.content,
        originalCWComment: originalNote.contents_warning_comment,
      }
    : undefined;

  return {
    id: note.id,
    content: note.content,
    contentsWarningComment: note.contents_warning_comment,
    author,
    reactions: note.reactions.map((reaction) => ({
      emoji: reaction.emoji,
      reactedBy: reaction.reacted_by,
    })),
    loggedInAccountID,
    renoteInfo,
  };
}
