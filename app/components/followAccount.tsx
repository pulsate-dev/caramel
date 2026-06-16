import { Link } from "react-router";

import { defaultAccountAvatar } from "~/lib/defaultAccountImage";

import styles from "~/components/followAccount.module.css";

export interface FollowAccountProps {
  name: string;
  nickname: string;
  avatarURL: string;
}

export function FollowAccount(data: FollowAccountProps) {
  return (
    <div className={styles.followAccount}>
      <Link to={`/accounts/${data.name}`}>
        <div className={styles.avatarNameContainer}>
          <img
            src={defaultAccountAvatar(data.avatarURL)}
            alt={`${data.nickname || data.name}'s avatar`}
            loading="lazy"
            className={styles.avatar}
          />
          <span className={styles.accountNameContainer}>
            {data.nickname === "" ? (
              <>
                <span>{data.nickname}</span> <span>({data.name})</span>
              </>
            ) : (
              <>
                <span>{data.nickname}</span>
              </>
            )}
          </span>
        </div>
      </Link>
    </div>
  );
}
