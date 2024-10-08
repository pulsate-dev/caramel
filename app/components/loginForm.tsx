import styles from "~/components/login.module.css";

export const LoginForm = () => {
  return (
    <>
      <h1 className={styles.loginForm}>Welcome back</h1>
      <form action="" className={styles.loginForm}>
        <label htmlFor="email">E-Mail [required]</label>
        <input type="email" id="email" required />
        <label htmlFor="password">Passphrase [required]</label>
        <input type="password" id="password" required />
        <button>Log in</button>
      </form>
    </>
  );
};
