import { Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { account } from "~/lib/account";
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

  const accountDatum = await account(parsedToken.id, token);
  return { isLoggedIn: !("error" in accountDatum) };
};

export function meta() {
  return [{ title: "Caramel" }];
}

export default function Index() {
  const accountDatum = useLoaderData<typeof loader>();
  const isLoggedIn = accountDatum.isLoggedIn;

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
            {isLoggedIn ? (
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
