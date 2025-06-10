import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { Form, Link, redirect } from "react-router";

import styles from "~/components/login.module.css";
import { accountCookie, login } from "~/lib/login";

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const passphrase = formData.get("passphrase") as string;

  const res = await login({ name, passphrase });
  if ("error" in res) {
    return res.error;
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
  return (
    <>
      <h1 className={styles.loginForm}>Welcome back</h1>
      <p className={styles.loginForm}>
        New to this instance? <Link to="/signup">Sign up</Link>
      </p>

      <Form method="post" className={styles.loginForm}>
        <label htmlFor="name">Account name [required]</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="@hello@s.pulsate.dev"
          autoComplete="username"
        />
        <label htmlFor="password">Passphrase [required]</label>
        <input
          type="password"
          id="password"
          name="passphrase"
          required
          autoComplete="current-password"
        />

        <button type="submit">Log in</button>
      </Form>
    </>
  );
}
