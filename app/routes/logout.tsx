import { Form, redirect } from "@remix-run/react";
import { accountCookie } from "~/lib/login";

export const action = async () => {
  const resetCookie = await accountCookie.serialize("", {
    httpOnly: true,
    sameSite: "strict",
    // Note: This is a hack to make the cookie expire immediately.
    expires: new Date("1970-01-01T00:00:00.000Z"),
  });
  return redirect("/", {
    headers: { "Set-Cookie": resetCookie },
  });
};

export default function Logout() {
  return (
    <>
      <h1>Sign out</h1>
      <p>Are you sure you want to sign out?</p>
      <Form method="post">
        <a href="/">Back to Home</a> | <button type="submit">Sign out</button>
      </Form>
    </>
  );
}
