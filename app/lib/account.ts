import type { TimelineResponse } from "~/lib/api/timeline";

export interface AccountResponse {
  id: string;
  name: string;
  nickname: string;
  bio: string;
  avatar: string;
  header: string;
  followed_count: number;
  following_count: number;
  note_count: number;
}

export const account = async (
  identifier: string,
  token: string | undefined,
  basePath: string
): Promise<AccountResponse | { error: string }> => {
  try {
    const res = await fetch(new URL(`/v0/accounts/${identifier}`, basePath), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return { error: "failed to fetch" };
    }
    return (await res.json()) as AccountResponse;
  } catch {
    return { error: "unknown error" };
  }
};

export const accountTimeline = async (
  id: string,
  token: string | undefined,
  basePath: string,
  beforeID?: string
): Promise<TimelineResponse[] | { error: string }> => {
  try {
    const url = new URL(`/v0/timeline/accounts/${id}`, basePath);
    if (beforeID) {
      url.searchParams.append("before_id", beforeID);
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return (await res.json()) as { error: string };
    }
    return (await res.json()) as TimelineResponse[];
  } catch {
    return { error: "unknown error" };
  }
};
