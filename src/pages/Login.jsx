import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (isLoggedIn) {
      navigate("/dashboard/upload");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Fetch registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if any user matches entered credentials
    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      // Save login session info
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      navigate("/dashboard");
    } else {
      setError("❌ Invalid email or password.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don’t have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}
