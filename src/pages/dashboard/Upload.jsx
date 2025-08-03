import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("❌ Please select a file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        setMessage("🚫 Not logged in.");
        return;
      }

      const reports = JSON.parse(localStorage.getItem("reports")) || {};
      const userReports = reports[currentUser.email] || [];

      userReports.push({
        name: file.name,
        data: reader.result,
        uploadedAt: new Date().toISOString(),
      });

      reports[currentUser.email] = userReports;
      localStorage.setItem("reports", JSON.stringify(reports));

      setMessage("✅ Report uploaded successfully!");
      setFile(null);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2>📤 Upload Blood Report</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
        />
        <br /><br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
