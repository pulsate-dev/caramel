import { useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  Links,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "react-router";
import { SideBar } from "~/components/sideBar";
import { account, AccountResponse } from "~/lib/account";
import { accountCookie } from "~/lib/login";
import { parseToken } from "~/lib/parseToken";
import styles from "~/root.module.css";
import { loggedInAccountAtom } from "./lib/atoms/loggedInAccount";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<
  { isSuccess: true; response: AccountResponse } | { isSuccess: false }
> {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { isSuccess: false };
  }

  const parsedToken = parseToken(token);
  if (parsedToken instanceof Error) {
    return { isSuccess: false };
  }

  const accountDatum = await account(parsedToken.id, token);
  if ("error" in accountDatum) {
    return { isSuccess: false };
  }

  return { isSuccess: true, response: accountDatum };
}

export async function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();

  const setLoggedInAccount = useSetAtom(loggedInAccountAtom);

  useEffect(() => {
    setLoggedInAccount(
      loaderData.isSuccess
        ? {
            id: loaderData.response.id,
            name: loaderData.response.name,
            nickname: loaderData.response.nickname,
            avatarURL: loaderData.response.avatar,
            headerURL: loaderData.response.header,
          }
        : undefined
    );
  }, [loaderData]);

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
