import { Link, MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "Sign up success! | Caramel" },
  {
    content: "noindex",
  },
];

export default function SignupSuccess() {
  return (
    <>
      <h1>You are almost there!</h1>

      <p>
        We have sent you a confirmation email. Click the link in the email to
        complete your registration.
      </p>

      <Link to="/">Back to Home</Link>
    </>
  );
}
