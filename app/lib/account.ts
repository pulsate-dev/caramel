import {
  getV0AccountsIdentifier,
  getV0TimelineAccountsId,
} from "@pulsate-dev/exp-api-types";

import type { TimelineResponse } from "~/lib/api/timeline";

import { apiOptions, parseApiErrorMessage } from "./api/client";

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
    const { data, error } = await getV0AccountsIdentifier({
      ...apiOptions(basePath, token),
      path: { identifier },
    });
    if (error || !data) {
      return { error: error ? parseApiErrorMessage(error) : "failed to fetch" };
    }
    return {
      id: data.id,
      name: data.name,
      nickname: data.nickname,
      bio: data.bio,
      avatar: data.avatar,
      header: data.header,
      followed_count: data.followed_count,
      following_count: data.following_count,
      note_count: data.note_count,
    };
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
    const { data, error } = await getV0TimelineAccountsId({
      ...apiOptions(basePath, token),
      path: { id },
      query: beforeID ? { before_id: beforeID } : undefined,
    });
    if (error || !data) {
      return { error: parseApiErrorMessage(error) };
    }
    return data.map(
      (note) =>
        ({
          ...note,
          created_at: new Date(note.created_at),
          visibility: note.visibility as TimelineResponse["visibility"],
        }) satisfies TimelineResponse
    );
  } catch {
    return { error: "unknown error" };
  }
};
