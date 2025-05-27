import { Turnstile } from "@marsidev/react-turnstile";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  TypedResponse,
} from "@remix-run/cloudflare";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import styles from "~/components/signup.module.css";

export const action = async ({
  request,
  context,
}: ActionFunctionArgs): Promise<{ error: string } | TypedResponse<never>> => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const passphrase = formData.get("passphrase") as string;
  const turnstileToken = formData.get("cf-turnstile-response");

  try {
    const response = await fetch(
      new URL("/v0/accounts", context.cloudflare.env.API_BASE_URL),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `@${name}@${context.cloudflare.env.INSTANCE_FQDN}`,
          email,
          passphrase,
          captcha_token: turnstileToken,
        }),
      }
    );
    if (!response.ok) {
      return { error: "Failed to create account" };
    }

    return redirect("/signup/success");
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong" };
  }
};

export const loader = async ({
  context,
}: LoaderFunctionArgs): Promise<
  { turnstileKey: string } | { error: string }
> => {
  const env = context.cloudflare.env as Env;

  if (!env.TURNSTILE_KEY) {
    return { error: "TURNSTILE_TOKEN is not set" };
  }
  return { turnstileKey: env.TURNSTILE_KEY };
};

export default function Signup_index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className={styles.form}>Sign up</h1>
      <p className={styles.form}>
        Already have account? <Link to="/login">Sign in</Link>
      </p>

      <Form method="post" className={styles.form}>
        <label>
          Account Name [required]
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="hello"
            autoComplete="username"
          />
        </label>

        <label>
          Email Address [required]
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="johndoe@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Passphrase [required]
          <input
            type="password"
            id="passphrase"
            name="passphrase"
            required
            autoComplete="new-password"
          />
        </label>

        {"error" in loaderData ? (
          <div>
            <h2>Loading error</h2>
            <p>Something went wrong. Try reloading the page.</p>
          </div>
        ) : (
          <Turnstile siteKey={loaderData.turnstileKey} />
        )}

        <button type="submit">Sign up</button>
      </Form>
    </>
  );
}
