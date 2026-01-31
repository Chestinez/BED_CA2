function Navbar() {
  return (
    <div
      className="sidebar p-4 border-end border-secondary"
      style={{ width: "250px" }}
    >
      <h3 className="mb-5 neon-text">Welcome</h3>
      <nav className="nav flex-column">
        <a className="nav-link text-white active" href="/dashboard">
          Dashboard
        </a>
        {/* TODO: Implement these pages or remove these links */}
        <a className="nav-link text-white" href="/shop">
          Shop
        </a>
        {/* <a className="nav-link text-white" href="#">Challenges</a> */}
        <a className="nav-link text-white" href="/challenges">
          Challenges
        </a>
      </nav>
    </div>
  );
}

export default Navbar;
