import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { Form, Link, redirect, useActionData } from "react-router";

import styles from "~/components/login.module.css";
import { accountCookie, login } from "~/lib/api/login";

const ERROR_MESSAGES = {
  invalidCredentials: "Invalid credentials. Please try again.",
  connectionFailed: "Connection failed. Please try again later.",
} as const;

type ActionData = {
  error: (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
};

export const meta: MetaFunction = () => {
  return [
    {
      title: "Sign in | Caramel",
    },
    {
      content: "noindex",
    },
  ];
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const passphrase = formData.get("passphrase") as string;

  const basePath = (context.cloudflare.env as Env).API_BASE_URL;
  const res = await login({ email, passphrase }, basePath);
  if ("error" in res) {
    const errorMessage =
      res.error === "INVALID_CREDENTIALS"
        ? ERROR_MESSAGES.invalidCredentials
        : ERROR_MESSAGES.connectionFailed;
    return { error: errorMessage } satisfies ActionData;
  }

  const accountTokenCookie = await accountCookie.serialize(
    res.authorization_token,
    { httpOnly: true, sameSite: "strict" }
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": accountTokenCookie,
    },
  });
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const errorMessage = actionData?.error;

  return (
    <>
      <h1 className={styles.loginForm}>Welcome back</h1>
      <p className={styles.loginForm}>
        New to this instance? <Link to="/signup">Sign up</Link>
      </p>

      <Form method="post" className={styles.loginForm}>
        <label htmlFor="email">Email address [required]</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="name@example.com"
          autoComplete="email"
        />
        <label htmlFor="password">Passphrase [required]</label>
        <input
          type="password"
          id="password"
          name="passphrase"
          required
          autoComplete="current-password"
        />

        {errorMessage ? (
          <p role="alert" className={styles.errorMessage}>
            {errorMessage}
          </p>
        ) : null}

        <button type="submit">Log in</button>
      </Form>
    </>
  );
}
