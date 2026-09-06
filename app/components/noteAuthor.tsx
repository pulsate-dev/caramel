import { Link } from "react-router";

import type { NoteAuthorData } from "~/components/note.types";
import { defaultAccountAvatar } from "~/lib/defaultAccountImage";

import styles from "~/components/noteAuthor.module.css";

export function NoteAuthor({ author }: { author: NoteAuthorData }) {
  return (
    <Link to={`/accounts/${author.name}`}>
      <div className={styles.accountNameContainer}>
        <div className={styles.avatarImageContainer}>
          <img
            src={defaultAccountAvatar(author.avatar)}
            alt={`${author.nickname}'s avatar`}
            loading="lazy"
          />
        </div>
        <h2>
          <bdi>{author.nickname}</bdi>
          <span>@{author.name.split("@")[1]}</span>
        </h2>
      </div>
    </Link>
  );
}
