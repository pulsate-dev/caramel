import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  Links,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "react-router";
import { SideBar } from "~/components/sideBar";
import { account } from "~/lib/account";
import { accountCookie } from "~/lib/login";
import { parseToken } from "~/lib/parseToken";
import styles from "~/root.module.css";

export interface LoggedInAccountDatum {
  id: string;
  name: string;
  nickname: string;
  avatarURL: string;
  headerURL: string;
}
export const loggedInAccountAtom = atomWithStorage<
  LoggedInAccountDatum | undefined
>("loggedInAccount", undefined);

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<{ id: string; token: string } | false> {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return false;
  }

  const parsedToken = parseToken(token);
  if (parsedToken instanceof Error) {
    return false;
  }
  // ToDo: tokenを返すのはセキュリティー的にやめたほうが良いかもしれない
  return { id: parsedToken.id, token: token };
}

export async function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();

  if (loaderData !== false) {
    const [loggedInAccount, setLoggedInAccount] = useAtom(loggedInAccountAtom);
    if (!loggedInAccount) {
      // update loggedInAccountAtom
      const accountDatum = await account(loaderData.id, loaderData.token);
      if ("error" in accountDatum) {
        throw new Error("failed to fetch logged in account data");
      }

      setLoggedInAccount({
        id: accountDatum.id,
        name: accountDatum.name,
        nickname: accountDatum.nickname,
        avatarURL: accountDatum.avatar,
        headerURL: accountDatum.header,
      });
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-mini.png" />
        <link rel="icon" href="/favicon.svg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className={styles.center}>
          <div className={styles.layout}>
            <SideBar />
            <div className={styles.root}>
              {children}
              <Scripts />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
