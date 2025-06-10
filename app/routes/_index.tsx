import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { account } from "~/lib/account";
import { getToken } from "~/lib/api/getToken";
import { parseToken } from "~/lib/parseToken";

export const loader = async ({
  request,
  context,
}: LoaderFunctionArgs): Promise<{ isLoggedIn: boolean }> => {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return { isLoggedIn: false };
  }
  const token = isLoggedIn.token;

  const parsedToken = parseToken(token);
  if (parsedToken instanceof Error) {
    return { isLoggedIn: false };
  }

  const basePath = (context.cloudflare.env as Env).API_BASE_URL;
  const accountDatum = await account(parsedToken.id, token, basePath);
  return { isLoggedIn: !("error" in accountDatum) };
};

export function meta() {
  return [{ title: "Caramel" }];
}

export default function Index() {
  const { isLoggedIn } = useLoaderData<typeof loader>();

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
