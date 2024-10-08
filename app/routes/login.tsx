import { MetaFunction } from "@remix-run/react";
import { LoginForm } from "~/components/loginForm";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Log in | Caramel",
      description: "Log in to your account",
    },
  ];
};

export default function Login() {
  return (
    <>
      <LoginForm />
    </>
  );
}
