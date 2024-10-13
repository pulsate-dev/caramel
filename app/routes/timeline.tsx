import { MetaFunction } from "@remix-run/react";
import { Note } from "~/components/note";
import styles from "~/styles/timeline.module.css";

export const meta: MetaFunction = () => {
  return [
    {title: "Timeline | Caramel"},
    {content: "noindex"}
  ]
}

export default function Timeline() {
  return (
    <div className={styles.noteContainer}>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
      <Note/>
    </div>
  )
}
