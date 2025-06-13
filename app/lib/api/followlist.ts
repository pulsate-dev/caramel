import type {
  GetV0AccountsIdFollowerResponse,
  GetV0AccountsIdFollowingResponse,
} from "@pulsate-dev/exp-api-types";

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
    const followingRes = await fetch(
      new URL(`/v0/accounts/${accountID}/following`, basePath),
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (!followingRes.ok) {
      return { isSuccess: false };
    }

    const accounts =
      (await followingRes.json()) as GetV0AccountsIdFollowingResponse;

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
    const followerRes = await fetch(
      new URL(`/v0/accounts/${accountID}/follower`, basePath),
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (!followerRes.ok) {
      return { isSuccess: false };
    }

    const accounts =
      (await followerRes.json()) as GetV0AccountsIdFollowerResponse;

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
