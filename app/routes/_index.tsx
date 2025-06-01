import { useAtom } from "jotai/index";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { account } from "~/lib/account";
import { accountCookie } from "~/lib/login";
import { parseToken } from "~/lib/parseToken";
import { loggedInAccountAtom, LoggedInAccountDatum } from "~/root";

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<LoggedInAccountDatum | undefined> => {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return undefined;
  }

  const parsedToken = parseToken(token);
  if (parsedToken instanceof Error) {
    return undefined;
  }

  const accountDatum = await account(parsedToken.id, token);
  if ("error" in accountDatum) {
    return undefined;
  }
  return {
    id: accountDatum.id,
    name: accountDatum.name,
    nickname: accountDatum.nickname,
    avatarURL: accountDatum.avatar,
    headerURL: accountDatum.header,
  };
};

export default function Index() {
  const accountDatum = useLoaderData<typeof loader>();
  const [loggedInAccountDatum, setLoggedInAccount] =
    useAtom(loggedInAccountAtom);
  const ifDatumExists = loggedInAccountDatum !== undefined;

  const isLoggedIn = accountDatum !== undefined;
  console.debug(loggedInAccountDatum, accountDatum);
  // ログインしていてデータがないなら更新する
  if (!ifDatumExists && isLoggedIn) {
    setLoggedInAccount(accountDatum);
  }
  // ログアウトしていてデータがあるなら削除する
  if (ifDatumExists && !isLoggedIn) {
    setLoggedInAccount(undefined);
  }

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
