import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import { SideBar } from "~/components/sideBar";
import styles from "~/root.module.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
