import { Link, Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          backgroundColor: "#f0f0f0",
          padding: "1rem",
        }}
      >
        <h2>📊 Dashboard</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link to="/dashboard/upload">Upload Report</Link>
          <Link to="/dashboard/history">Report History</Link>
          {/* <Link to="/dashboard/summary">AI Summary</Link> */}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
