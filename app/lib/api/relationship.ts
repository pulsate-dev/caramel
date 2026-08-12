import { getV0AccountsIdRelationships } from "@pulsate-dev/exp-api-types";

import { logger } from "../logger";
import { apiOptions } from "./client";

export interface AccountRelationshipResponse {
  id: string;
  isFollowed: boolean;
  isFollowing: boolean;
  isFollowRequesting: boolean;
}

export async function accountRelationship(
  basePath: string,
  token: string,
  accountID: string
): Promise<
  | { isSuccess: true; response: AccountRelationshipResponse }
  | { isSuccess: false }
> {
  try {
    const { data: relationship, error } = await getV0AccountsIdRelationships({
      ...apiOptions(basePath, token),
      path: { id: accountID },
    });
    if (error || !relationship) {
      return { isSuccess: false };
    }

    return {
      isSuccess: true,
      response: {
        id: relationship.id,
        isFollowed: relationship.is_followed,
        isFollowing: relationship.is_following,
        isFollowRequesting: relationship.is_follow_requesting,
      },
    };
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { isSuccess: false };
  }
}
