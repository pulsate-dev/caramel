import { ActionFunctionArgs } from "@remix-run/node";
import { Form, MetaFunction, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import styles from "~/components/login.module.css";
import { login } from "~/lib/login";
import { parseToken } from "~/lib/parseToken";
import { getAccount } from "~/lib/account";
import { useLoggedInAccount } from "~/hooks/accountData";

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
  const {account, setAccount} = useLoggedInAccount();

  useEffect(() => {
    if (!data) return;
    if ("error" in data) return;

    localStorage.setItem("authToken", data.authorization_token);

    getAccount(parseToken(data.authorization_token).id).then(accountRes => {
      if ("error" in accountRes) {
        console.log(accountRes.error);
        return;
      }

      setAccount({
        id: accountRes.id,
        name: accountRes.name,
        nickname: accountRes.nickname,
      });
      // FIXME: Should use redirect() ?
      window.location.href = "/";
    })
  }, [data]);

  return (
    <>
      <h1 className={styles.loginForm}>Welcome back</h1>
      {(() => {
        if (!data) return null;
        if ("error" in data) return <p>{data.error}</p>;
        return <p>Logged in {account?.name}</p>;
      })()}

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
