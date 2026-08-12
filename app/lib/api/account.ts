import type {
  UpdateAccountRequest,
  UpdateAccountResponse,
} from "@pulsate-dev/exp-api-types";
import {
  getV0AccountsIdentifier,
  getV0TimelineAccountsId,
  patchV0AccountsName,
} from "@pulsate-dev/exp-api-types";

import type { TimelineResponse } from "~/lib/api/timeline";

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
      ...apiOptions(basePath, token),
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
  beforeID?: string
): Promise<TimelineResponse[] | { error: string }> => {
  try {
    const { data: response, error } = await getV0TimelineAccountsId({
      ...apiOptions(basePath, token),
      path: { id },
      query: beforeID ? { before_id: beforeID } : undefined,
    });
    if (error || !response) {
      return { error: parseApiErrorMessage(error) };
    }

    return response.map(
      (item) =>
        ({
          id: item.id,
          content: item.content,
          contents_warning_comment: item.contents_warning_comment,
          visibility: item.visibility as "PUBLIC" | "HOME" | "FOLLOWERS",
          created_at: new Date(item.created_at),
          author: {
            id: item.author.id,
            name: item.author.name,
            display_name: item.author.display_name,
            bio: item.author.bio,
            avatar: item.author.avatar,
            header: item.author.header,
            followed_count: item.author.followed_count,
            following_count: item.author.following_count,
          },
          reactions: item.reactions.map(
            (reaction): TimelineResponse["reactions"][number] => ({
              emoji: reaction.emoji,
              reacted_by: reaction.reacted_by,
            })
          ),
        }) satisfies TimelineResponse
    );
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
      ...apiOptions(basePath, token),
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
