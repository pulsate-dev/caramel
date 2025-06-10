import type {
  PostV0LoginError,
  PostV0LoginResponse,
} from "@pulsate-dev/exp-api-types";
import { createCookie } from "react-router";

export type LoginArgs = {
  name: string;
  passphrase: string;
};

export const login = async (
  { name, passphrase }: LoginArgs,
  basePath: string
): Promise<
  | { error: string }
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
        throw new Error("Invalid credentials");
      }
      throw new Error("Unknown error");
    }

    const res = (await response.json()) as
      | PostV0LoginError
      | PostV0LoginResponse;

    if ("authorization_token" in res) {
      return { authorization_token: res.authorization_token };
    }
    return { error: res.error };
  } catch (e) {
    return { error: (e as Error).message };
  }
};

export const accountCookie = createCookie("account", {
  maxAge: 60 * 15,
  httpOnly: true,
  sameSite: "lax",
  secure: true,
});
