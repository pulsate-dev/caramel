import { createCookie } from "@remix-run/cloudflare";

export type LoginArgs = {
  name: string;
  passphrase: string;
};

export const login = async ({
  name,
  passphrase,
}: LoginArgs): Promise<
  | { error: string }
  | {
      authorization_token: string;
    }
> => {
  try {
    const response = await fetch("http://localhost:3000/login", {
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
    return (await response.json()) as { authorization_token: string };
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
