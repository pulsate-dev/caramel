import type {
  UpdateAccountRequest,
  UpdateAccountResponse,
} from "@pulsate-dev/exp-api-types";
import {
  getV0AccountsIdentifier,
  getV0TimelineAccountsId,
  patchV0AccountsName,
} from "@pulsate-dev/exp-api-types";

import {
  normalizeTimelineNotes,
  type TimelineResponse,
} from "~/lib/api/timeline";

import { logger } from "../logger";
import { apiOptions, parseApiErrorMessage } from "./client";

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
    const {
      data: response,
      error,
      response: rawResponse,
    } = await getV0AccountsIdentifier({
      ...apiOptions(
        basePath,
        token,
        `/v0/accounts/${encodeURIComponent(identifier)}`
      ),
      path: { identifier },
    });
    if (error || !response) {
      switch (rawResponse?.status) {
        case 500:
          return { error: "internal server error" };
        case 404:
          return { error: "account not found" };
        default:
          return { error: "unknown error" };
      }
    }

    return {
      id: response.id,
      name: response.name,
      nickname: response.nickname,
      bio: response.bio,
      avatar: response.avatar,
      header: response.header,
      followed_count: response.followed_count,
      following_count: response.following_count,
      note_count: response.note_count,
    } satisfies AccountResponse;
  } catch {
    return { error: "unknown error" };
  }
};

export const accountTimeline = async (
  id: string,
  token: string | undefined,
  basePath: string,
  beforeID?: string,
  afterID?: string
): Promise<TimelineResponse[] | { error: string }> => {
  try {
    const { data: response, error } = await getV0TimelineAccountsId({
      ...apiOptions(
        basePath,
        token,
        `/v0/timeline/accounts/${encodeURIComponent(id)}`
      ),
      path: { id },
      query: beforeID
        ? { before_id: beforeID }
        : afterID
          ? { after_id: afterID }
          : undefined,
    });
    if (error || !response) {
      return { error: parseApiErrorMessage(error) };
    }

    const timelineNotes = normalizeTimelineNotes(response);
    return afterID
      ? timelineNotes.filter((note) => note.id !== afterID).reverse()
      : timelineNotes;
  } catch {
    return { error: "unknown error" };
  }
};

export const updateAccount = async (
  basePath: string,
  name: string,
  bio: string,
  nickname: string,
  token: string
): Promise<UpdateAccountResponse | { error: string }> => {
  try {
    const body: UpdateAccountRequest = {
      bio,
      nickname,
    };

    const { data, error, response } = await patchV0AccountsName({
      ...apiOptions(
        basePath,
        token,
        `/v0/accounts/${encodeURIComponent(name)}`
      ),
      body,
      path: { name },
    });
    if (error || !data) {
      switch (response?.status) {
        case 400:
          return { error: "invalid request" };
        case 404:
          return { error: "account not found" };
        case 500:
          return { error: "internal server error" };
        default:
          return { error: "unknown error" };
      }
    }

    return data;
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { error: "unknown error" };
  }
};
