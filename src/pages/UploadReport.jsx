import { useState } from "react";

export default function UploadReport() {
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
      setMessage("❌ Please select a file first.");
      return;
    }

    // Convert file to base64 and store in localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const reports = JSON.parse(localStorage.getItem("reports")) || {};
      const userReports = reports[user.email] || [];

      userReports.push({
        name: file.name,
        data: reader.result,
        uploadedAt: new Date().toISOString(),
      });

      reports[user.email] = userReports;
      localStorage.setItem("reports", JSON.stringify(reports));

      setMessage("✅ File uploaded successfully!");
      setFile(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Blood Report</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
        />
        <br />
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
