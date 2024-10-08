import { ActionFunctionArgs } from "@remix-run/node";
import { Form, MetaFunction, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import styles from "~/components/login.module.css";
import { login } from "~/hooks/login";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Log in | Caramel",
    },
    {
      content: "noindex",
    },
  ];
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<
  | { authorization_token: string }
  | {
      error: string;
    }
> => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const passphrase = formData.get("passphrase") as string;
  return login({ name, passphrase });
};

export default function Login() {
  const data = useActionData<typeof action>();

  useEffect(() => {
    if (!data) return;
    if ("error" in data) return;

    localStorage.setItem("authToken", data.authorization_token);
    // FIXME: Should use redirect() ?
    window.location.href = "/";
  }, [data]);

  return (
    <>
      <h1 className={styles.loginForm}>Welcome back</h1>

      {(() => {
        if (!data) return null;
        if ("error" in data) return <p>{data.error}</p>;
        return <p>Logged in</p>;
      })()}

      <Form method="post" className={styles.loginForm}>
        <label htmlFor="name">Account name [required]</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="@hello@s.pulsate.dev"
        />
        <label htmlFor="password">Passphrase [required]</label>
        <input type="password" id="password" name="passphrase" required />

        <button type="submit">Log in</button>
      </Form>
    </>
  );
}
