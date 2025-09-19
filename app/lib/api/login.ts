import type {
  PostV0LoginError,
  PostV0LoginResponse,
} from "@pulsate-dev/exp-api-types";
import { createCookie } from "react-router";

export type LoginArgs = {
  name: string;
  passphrase: string;
};

export type ERROR_MESSAGES = "INVALID_CREDENTIALS" | "CONNECTION_FAILED";

export const login = async (
  { name, passphrase }: LoginArgs,
  basePath: string
): Promise<
  | { error: ERROR_MESSAGES }
  | {
      authorization_token: string;
    }
> => {
  try {
    const response = await fetch(new URL("/v0/login", basePath), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, passphrase, captcha_token: "" }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        return { error: "INVALID_CREDENTIALS" };
      }
      return { error: "CONNECTION_FAILED" };
    }

    const res = (await response.json()) as
      | PostV0LoginError
      | PostV0LoginResponse;

    if (!("authorization_token" in res)) {
      console.error(
        "Unexpected response: response does not contains authorization_token.",
        res
      );
      return { error: "CONNECTION_FAILED" };
    }
    return { authorization_token: res.authorization_token };
  } catch (e) {
    console.error("Unexpected Error:", e);
    return { error: "CONNECTION_FAILED" };
  }
};

export const accountCookie = createCookie("account", {
  maxAge: 60 * 15,
  httpOnly: true,
  sameSite: "lax",
  secure: true,
});
