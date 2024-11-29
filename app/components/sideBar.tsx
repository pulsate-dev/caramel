import { Link } from "@remix-run/react";
import style from "~/components/sideBar.module.css";

interface SideBarLink {
  name: string;
  to: string;
}

export const SideBar = () => {
  const link: readonly SideBarLink[] = [
    { name: "Home", to: "/" },
    { name: "Timeline", to: "/timeline" },
    { name: "Notification", to: "#" },
    { name: "Search", to: "#" },
    { name: "Bookmark", to: "#" },
    { name: "List", to: "#" },
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
    </div>
  );
};
