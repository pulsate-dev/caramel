import styles from "~/components/note.module.css"

export const Note = () => {
  return (<div className={styles.note}>
    <div className={styles.accountNameContainer}>
      <h2>Nickname <span>@username@example.test</span></h2>
    </div>
    <p>hello hello hello hello hello hello hello hello hello </p>
  </div>)
}
