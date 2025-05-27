import { TimelineResponse } from "~/lib/timeline";

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
  token: string | undefined
): Promise<AccountResponse | { error: string }> => {
  try {
    const res = await fetch(`http://localhost:3000/v0/accounts/${identifier}`, {
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
  beforeID?: string
): Promise<TimelineResponse[] | { error: string }> => {
  try {
    const url = new URL(`http://localhost:3000/v0/timeline/accounts/${id}`);
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
