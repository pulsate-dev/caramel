import { getV0NotesId } from "@pulsate-dev/exp-api-types";

import type { TimelineResponse } from "~/lib/api/timeline";

import { logger } from "../logger";
import { apiOptions, parseApiErrorMessage } from "./client";

export const fetchOriginalNotes = async (
  notes: TimelineResponse[],
  token: string,
  basePath: string
): Promise<TimelineResponse[]> => {
  const renoteNotes = notes.filter((note) => note.original_note_id);
  const results = await Promise.all(
    renoteNotes.map((note) =>
      fetchNote(token, basePath, note.original_note_id!)
    )
  );
  return results.filter(
    (result): result is TimelineResponse => !("error" in result)
  );
};

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
