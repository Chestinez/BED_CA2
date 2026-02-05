import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      className="sidebar p-4 border-end border-secondary"
      style={{ width: "250px" }}
    >
      <h3 className="mb-5 neon-text">Welcome</h3>
      <nav className="nav flex-column">
        <Link className="nav-link text-white active" to="/dashboard">
          Dashboard
        </Link>
        {/* TODO: Implement these pages or remove these links */}
        <Link className="nav-link text-white" to="/shop">
          Shop
        </Link>
        {/* <Link className="nav-link text-white" to="#">Challenges</Link> */}
        <Link className="nav-link text-white" to="/challenges">
          Challenges
        </Link>
        <Link className="nav-link text-white" to="/challenges/profile">
          My Challenges
        </Link>
        <Link className="nav-link text-white" to="/leaderboard">
          Leaderboard
        </Link>
        <Link className="nav-link text-white" to="/profile">
          Profile
        </Link>
        <Link className="nav-link text-white" to="/inventory">
          Inventory
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;
