import { Link } from "react-router";
import style from "~/components/sideBar.module.css";
<<<<<<< HEAD
import type { LoggedInAccountDatum } from "~/lib/loggedInAccount";
=======
import { LoggedInAccountDatum } from "~/lib/api/loggedInAccount";
>>>>>>> 317cc0a (wip: app/libにAPI関連のコードを移動)

interface SideBarLink {
  name: string;
  to: string;
}

export const SideBar = ({
  loggedInAccountDatum,
}: {
  loggedInAccountDatum?: LoggedInAccountDatum;
}) => {
  const isLoggedIn = loggedInAccountDatum !== undefined;

  const link: readonly SideBarLink[] = isLoggedIn
    ? [
        { name: "Home", to: "/" },
        { name: "Timeline", to: "/timeline" },
        { name: "Notification", to: "#" },
        { name: "Search", to: "#" },
        { name: "Bookmark", to: "#" },
        { name: "List", to: "#" },
        { name: "Profile", to: `/accounts/${loggedInAccountDatum.name}` },
        { name: "Settings", to: "#" },
        { name: "About", to: "#" },
      ]
    : [
        { name: "Home", to: "/" },
        { name: "Timeline", to: "/timeline" },
        { name: "Search", to: "#" },
        { name: "Settings", to: "#" },
        { name: "About", to: "#" },
      ];

  return (
    <div className={style.sideBarContainer}>
      <nav className={style.sideBar}>
        {link.map((v) => {
          return (
            <Link to={v.to} key={v.name} className={style.link}>
              <span>{v.name}</span>
            </Link>
          );
        })}
      </nav>

      {isLoggedIn ? (
        <div className={style.loggedInAccountContainer}>
          <img
            src={loggedInAccountDatum.avatarURL}
            alt={`${loggedInAccountDatum.nickname ?? loggedInAccountDatum.name}'s avatar`}
            className={style.avatar}
          />
          <span>
            {loggedInAccountDatum.nickname ?? loggedInAccountDatum.name}
          </span>
        </div>
      ) : (
        <div className={style.loginButton}>
          <span>
            <Link to="/login">Sign In</Link>
          </span>
        </div>
      )}
    </div>
  );
};
