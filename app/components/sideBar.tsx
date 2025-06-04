import { useAtom } from "jotai";
import { Link } from "react-router";
import style from "~/components/sideBar.module.css";
import { readonlyLoggedInAccountAtom } from "~/lib/atoms/loggedInAccount";

interface SideBarLink {
  name: string;
  to: string;
}

export const SideBar = () => {
  const [datum] = useAtom(readonlyLoggedInAccountAtom);

  const isLoggedIn = datum !== undefined;

  const link: readonly SideBarLink[] = isLoggedIn
    ? [
        { name: "Home", to: "/" },
        { name: "Timeline", to: "/timeline" },
        { name: "Notification", to: "#" },
        { name: "Search", to: "#" },
        { name: "Bookmark", to: "#" },
        { name: "List", to: "#" },
        { name: "Profile", to: `/accounts/${datum.name}` },
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
            src={datum.avatarURL}
            alt={`${datum.nickname ?? datum.name}'s avatar`}
            className={style.avatar}
          />
          <span>{datum.nickname ?? datum.name}</span>
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
