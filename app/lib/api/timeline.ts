import { getV0TimelineHome } from "@pulsate-dev/exp-api-types";

import { logger } from "../logger";
import { apiOptions, parseApiErrorMessage } from "./client";

export interface TimelineResponse {
  id: string;
  content: string;
  contents_warning_comment: string;
  visibility: "PUBLIC" | "HOME" | "FOLLOWERS";
  created_at: Date;
  author: {
    id: string;
    name: string;
    display_name: string;
    bio: string;
    avatar: string;
    header: string;
    followed_count: number;
    following_count: number;
  };
  reactions: {
    emoji: string;
    reacted_by: string;
  }[];
  original_note_id?: string;
}

export const fetchHomeTimeline = async (
  token: string,
  basePath: string,
  beforeID?: string
): Promise<{ notes: TimelineResponse[] } | { error: string }> => {
  try {
    const { data: notes, error } = await getV0TimelineHome({
      ...apiOptions(basePath, token),
      query: beforeID ? { before_id: beforeID } : undefined,
    });
    if (error || !notes) {
      logger.error("Fetch home timeline error:", error);
      return { error: parseApiErrorMessage(error) };
    }
    return {
      notes: notes.map(
        (note) =>
          ({
            ...note,
            created_at: new Date(note.created_at),
            visibility: note.visibility as TimelineResponse["visibility"],
          }) satisfies TimelineResponse
      ),
    };
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { error: "unknown error" };
  }
};
