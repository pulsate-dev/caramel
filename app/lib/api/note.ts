import type { TimelineResponse } from "~/lib/api/timeline";

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
      return (await res.json()) as { error: string };
    }
    return (await res.json()) as TimelineResponse;
  } catch {
    return { error: "unknown error" };
  }
};
