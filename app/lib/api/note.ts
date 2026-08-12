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
      ...apiOptions(basePath, token),
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
