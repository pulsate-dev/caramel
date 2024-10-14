import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Caramel: Pulsate minimal web interface</h1>
      <p>Hello world</p>
      <nav>
        <Link to="/timeline">Timeline</Link> <Link to="/login">Login</Link>
      </nav>
    </div>
  );
}
