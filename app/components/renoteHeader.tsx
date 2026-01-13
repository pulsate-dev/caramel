import { Link } from "react-router";
import styles from "~/components/renoteHeader.module.css";
import { defaultAccountAvatar } from "~/lib/defaultAccountImage";

interface RenoteHeaderProps {
  renoteBy: {
    avatar: string;
    name: string;
    nickname: string;
  };
  isQuote?: boolean;
}

export const RenoteHeader = ({ renoteBy, isQuote }: RenoteHeaderProps) => {
  return (
    <div className={styles.renoteHeader}>
      <span className={styles.renoteIcon}>🔁</span>
      <Link to={`/accounts/${renoteBy.name}`} className={styles.renoteLink}>
        <img
          src={defaultAccountAvatar(renoteBy.avatar)}
          alt={`${renoteBy.nickname}'s avatar`}
          className={styles.avatar}
          loading="lazy"
        />
        <span>
          {renoteBy.nickname} {isQuote ? "quoted" : "renoted"}
        </span>
      </Link>
    </div>
  );
};
