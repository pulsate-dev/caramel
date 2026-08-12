import { postV0Login } from "@pulsate-dev/exp-api-types";
import { createCookie } from "react-router";

import { logger } from "../logger";
import { apiOptions } from "./client";

export type LoginArgs = {
  email: string;
  passphrase: string;
};

export type ERROR_MESSAGES = "INVALID_CREDENTIALS" | "CONNECTION_FAILED";

export const login = async (
  { email, passphrase }: LoginArgs,
  basePath: string
): Promise<
  | { error: ERROR_MESSAGES }
  | {
      authorization_token: string;
    }
> => {
  try {
    const {
      data: res,
      error,
      response,
    } = await postV0Login({
      ...apiOptions(basePath),
      body: { email, passphrase, captcha_token: "" },
    });
    if (error || !res) {
      if (response?.status === 400) {
        return { error: "INVALID_CREDENTIALS" };
      }
      logger.error("Unexpected Error:", error);
      return { error: "CONNECTION_FAILED" };
    }

    if (!("authorization_token" in res)) {
      logger.error(
        "Unexpected response: response does not contains authorization_token.",
        res
      );
      return { error: "CONNECTION_FAILED" };
    }
    return { authorization_token: res.authorization_token };
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { error: "CONNECTION_FAILED" };
  }
};

export const accountCookie = createCookie("account", {
  maxAge: 60 * 15,
  httpOnly: true,
  sameSite: "lax",
  secure: true,
});
