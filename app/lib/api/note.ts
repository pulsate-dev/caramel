import { getV0NotesId } from "@pulsate-dev/exp-api-types";

import type { TimelineResponse } from "~/lib/api/timeline";

import { logger } from "../logger";
import { apiOptions, parseApiErrorMessage } from "./client";

export const fetchNote = async (
  token: string,
  basePath: string,
  noteID: string
): Promise<TimelineResponse | { error: string }> => {
  try {
    const { data: note, error } = await getV0NotesId({
      ...apiOptions(basePath, token, `/v0/notes/${encodeURIComponent(noteID)}`),
      path: { id: noteID },
    });
    if (error || !note) {
      logger.error("Fetch notes error:", error);
      return { error: parseApiErrorMessage(error) };
    }
    return {
      ...note,
      created_at: new Date(note.created_at),
      visibility: note.visibility as TimelineResponse["visibility"],
    };
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { error: "unknown error" };
  }
};

export const fetchOriginalNotes = async (
  notes: readonly TimelineResponse[],
  token: string,
  basePath: string
): Promise<TimelineResponse[]> => {
  const originalNoteIDs = [
    ...new Set(
      notes.flatMap((note) =>
        note.original_note_id ? [note.original_note_id] : []
      )
    ),
  ];

  if (originalNoteIDs.length === 0) {
    return [];
  }

  const results = await Promise.all(
    originalNoteIDs.map((noteID) => fetchNote(token, basePath, noteID))
  );

  return results.flatMap((result) => ("error" in result ? [] : [result]));
};
