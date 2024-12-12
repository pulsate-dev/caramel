import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { accountCookie } from "~/lib/login";
import { parseToken } from "~/lib/parseToken";

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<{ isLoggedIn: boolean }> => {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { isLoggedIn: false };
  }

  const parsedToken = parseToken(token);
  if (parsedToken instanceof Error) {
    return { isLoggedIn: false };
  }

  return { isLoggedIn: true };
};

export default function Index() {
  const isLoggedIn = useLoaderData<typeof loader>();

  return (
    <div>
      <img alt="Caramel logo" src="/caramel_logo.svg" />
      <h1>Caramel: Pulsate minimal web interface</h1>
      <p>Hello world</p>
      <nav>
        <ul>
          <li>
            <Link to="/timeline">Timeline</Link>
          </li>
          <li>
            {isLoggedIn.isLoggedIn ? (
              <Link to="/logout">Sign out</Link>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
