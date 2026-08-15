import {
  getV0TimelineHome,
  getV0TimelinePublic,
} from "@pulsate-dev/exp-api-types";

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

export type TimelineType = "home" | "public";

export const fetchTimeline = async (
  token: string,
  basePath: string,
  type: TimelineType,
  beforeID?: string,
  afterID?: string
): Promise<{ notes: TimelineResponse[] } | { error: string }> => {
  try {
    const options = {
      ...apiOptions(basePath, token),
      query: beforeID
        ? { before_id: beforeID }
        : afterID
          ? { after_id: afterID }
          : undefined,
    };
    const { data: notes, error } =
      type === "home"
        ? await getV0TimelineHome(options)
        : await getV0TimelinePublic(options);
    if (error || !notes) {
      logger.error(`Fetch ${type} timeline error:`, error);
      return { error: parseApiErrorMessage(error) };
    }
    const timelineNotes = notes.map(
      (note) =>
        ({
          ...note,
          created_at: new Date(note.created_at),
          visibility: note.visibility as TimelineResponse["visibility"],
        }) satisfies TimelineResponse
    );
    return {
      notes: afterID
        ? timelineNotes.filter((note) => note.id !== afterID).reverse()
        : timelineNotes,
    };
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { error: "unknown error" };
  }
};
