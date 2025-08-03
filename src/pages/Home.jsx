import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
//   const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setMessage("");
    }
  };

  const handleGuestUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("❌ Please select a report file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const uploadData = {
        name: file.name,
        data: reader.result,
        uploadedAt: new Date().toISOString(),
      };

      // Store in guestUpload
      localStorage.setItem("guestUpload", JSON.stringify(uploadData));
      setMessage("✅ Report uploaded! Create an account to save history.");
      setFile(null);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🏥 Welcome to Health Insights</h1>

      {!isLoggedIn && (
        <>
          <p>👤 You're browsing as a guest. Upload a report to try the app.</p>
          {message && <p>{message}</p>}
          <form onSubmit={handleGuestUpload}>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />
            <br /><br />
            <button type="submit">Upload as Guest</button>
          </form>
          <p style={{ marginTop: "1rem" }}>
            <b>🔐 Want to track and compare reports?</b><br />
            <a href="/signup">Create an account</a> or <a href="/login">Login</a>
          </p>
        </>
      )}

      {isLoggedIn && (
        <p>👋 You're logged in. Access your <Link to="/dashboard/upload">Dashboard</Link>.</p>

      )}
    </div>
  );
}
