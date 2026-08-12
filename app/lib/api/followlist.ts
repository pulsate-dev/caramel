import {
  getV0AccountsIdFollower,
  getV0AccountsIdFollowing,
} from "@pulsate-dev/exp-api-types";

import { logger } from "../logger";
import { apiOptions } from "./client";

interface FollowResponseBase {
  id: string;
  name: string;
  nickname: string;
  avatarURL: string;
}

export type FollowingResponse = FollowResponseBase;
export type FollowerResponse = FollowResponseBase;

export async function getFollowingList(
  basePath: string,
  token: string,
  accountID: string
): Promise<
  { isSuccess: true; response: FollowingResponse[] } | { isSuccess: false }
> {
  try {
    const { data: accounts, error } = await getV0AccountsIdFollowing({
      ...apiOptions(basePath, token),
      path: { id: accountID },
    });
    if (error || !accounts) {
      return { isSuccess: false };
    }

    return {
      isSuccess: true,
      response: accounts.map((account) => ({
        id: account.id,
        name: account.name,
        nickname: account.nickname,
        avatarURL: account.avatar,
      })),
    };
  } catch {
    return { isSuccess: false };
  }
}

export async function getFollowersList(
  basePath: string,
  token: string,
  accountID: string
): Promise<
  { isSuccess: true; response: FollowerResponse[] } | { isSuccess: false }
> {
  try {
    const { data: accounts, error } = await getV0AccountsIdFollower({
      ...apiOptions(basePath, token),
      path: { id: accountID },
    });
    if (error || !accounts) {
      return { isSuccess: false };
    }

    return {
      isSuccess: true,
      response: accounts.map((account) => ({
        id: account.id,
        name: account.name,
        nickname: account.nickname,
        avatarURL: account.avatar,
      })),
    };
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { isSuccess: false };
  }
}
