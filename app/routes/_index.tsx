import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { accountCookie } from "~/lib/login";
import { parseToken } from "~/lib/parseToken";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("hi");
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { state: false };
  }

  const parsedToken = parseToken(token);
  if (parsedToken instanceof Error) {
    return { state: false };
  }

  return { state: true };
};

export default function Index() {
  const isLoggedIn = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Caramel: Pulsate minimal web interface</h1>
      <p>Hello world</p>
      <nav>
        <ul>
          <li>
            <Link to="/timeline">Timeline</Link>
          </li>
          <li>
            {isLoggedIn.state ? (
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
