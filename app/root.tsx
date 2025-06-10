import {
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "react-router";
import { SideBar } from "~/components/sideBar";
import styles from "~/root.module.css";
import {
  loggedInAccount,
  type LoggedInAccountResponse,
} from "~/lib/api/loggedInAccount";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoggedInAccountResponse> {
  return loggedInAccount(request, "");
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();

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
            <SideBar
              loggedInAccountDatum={
                loaderData.isSuccess ? loaderData.response : undefined
              }
            />
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
