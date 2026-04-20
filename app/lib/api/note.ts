import type { TimelineResponse } from "~/lib/api/timeline";
import { logger } from "../logger";

export const fetchNote = async (
  token: string,
  basePath: string,
  noteID: string
): Promise<TimelineResponse | { error: string }> => {
  try {
    const res = await fetch(new URL(`/v0/notes/${noteID}`, basePath), {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const json = await res.json();
      logger.error("Fetch notes error:", json);
      return json as { error: string };
    }
    return (await res.json()) as TimelineResponse;
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { error: "unknown error" };
  }
};
