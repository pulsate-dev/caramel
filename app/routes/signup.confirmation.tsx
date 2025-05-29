import { Link, MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Sent confirmation | Caramel" },
  {
    content: "noindex",
  },
];

export default function SignupConfirmation() {
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
