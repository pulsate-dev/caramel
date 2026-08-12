import {
  deleteV0AccountsNameFollow,
  postV0AccountsNameFollow,
} from "@pulsate-dev/exp-api-types";

import { logger } from "../logger";
import { apiOptions } from "./client";

export async function followAccount(
  basePath: string,
  token: string,
  accountName: string
): Promise<{ isSuccess: boolean }> {
  try {
    const { error } = await postV0AccountsNameFollow({
      ...apiOptions(basePath, token),
      path: { name: accountName },
    });
    if (error) {
      return { isSuccess: false };
    }
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { isSuccess: false };
  }

  return { isSuccess: true };
}

export async function unfollowAccount(
  basePath: string,
  token: string,
  accountName: string
): Promise<{ isSuccess: boolean }> {
  try {
    const { error } = await deleteV0AccountsNameFollow({
      ...apiOptions(basePath, token),
      path: { name: accountName },
    });
    if (error) {
      logger.error("Unexpected Error:", error);
      return { isSuccess: false };
    }
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { isSuccess: false };
  }

  return { isSuccess: true };
}
