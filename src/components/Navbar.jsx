import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav
      style={{
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>

        {!isLoggedIn && (
          <>
            <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>

      {isLoggedIn && currentUser && (
        <div style={{ position: "relative" }}>
          <div
            onClick={toggleDropdown}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            👤 {currentUser.name}
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "120%",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                padding: "0.5rem 1rem",
                zIndex: 1000,
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
              }}
            >
              <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)}>
                Profile
              </Link>
              <button
                onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                }}
                style={{
                    background: "none",
                    border: "none",
                    color: "#d00",
                    cursor: "pointer",
                    padding: 0,
                    textAlign: "left"
                }}
                >Logout
                </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
