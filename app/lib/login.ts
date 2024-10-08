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
      console.error(response);
      if (response.status === 400) {
        throw new Error("Invalid credentials");
      }
      throw new Error("Unknown error");
    }
    const { authorization_token } = await response.json();
    return { authorization_token };
  } catch (e) {
    return { error: (e as Error).message };
  }
};
