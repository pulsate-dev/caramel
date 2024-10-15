import { Link } from "@remix-run/react";
import { useLoggedInAccount } from "~/hooks/accountData";

export default function Index() {
  const {account} = useLoggedInAccount();
  return (
    <div>
      <h1>Caramel: Pulsate minimal web interface</h1>
      <p>Hello world {account?.nickname ?? "Guest"}</p>
      <nav>
        <Link to="/timeline">Timeline</Link> <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}
