import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");

function parseCBCValues(text) {
  const fields = {
    hemoglobin: /hemoglobin[^\d]*(\d+\.?\d*)/i,
    rbc: /total rbc[^\d]*(\d+\.?\d*)/i,
    pcv: /packed cell volume[^\d]*(\d+)/i,
    mcv: /mean corpuscular volume[^\d]*(\d+)/i,
    mch: /mch[\s\S]*?(\d+\.?\d*)/i,
    mchc: /(?:mchc|bth)[^\d]*(\d+\.?\d*)/i,
    rdw: /(?:rdw|row)[^\d]*(\d+\.?\d*)/i,
    wbc: /total wbc[^\d]*(\d+)/i,
    neutrophils: /neutrophils[^\d]*(\d+)/i,
    lymphocytes: /lymphocytes[^\d]*(\d+)/i,
    eosinophils: /eosinophils[^\d]*(\d+)/i,
    monocytes: /(?:monocytes|monacytes)[^\d]*(\d+)/i,
    basophils: /basophils[^\d]*(\d+)/i,
    platelets: /platelet count[^\d]*(\d+)/i
  };

  const result = {};
  for (const [key, regex] of Object.entries(fields)) {
    const match = text.match(regex);
    result[key] = match ? match[1] : "";
  }
  return result;
}

export default function Upload() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    hemoglobin: "",
    rbc: "",
    pcv: "",
    mcv: "",
    mch: "",
    mchc: "",
    rdw: "",
    wbc: "",
    neutrophils: "",
    lymphocytes: "",
    eosinophils: "",
    monocytes: "",
    basophils: "",
    platelets: ""
  });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng");
      console.log("OCR Result:", text);
      const parsed = parseCBCValues(text);
      setFormData(parsed);
    } catch (err) {
      console.error("OCR failed:", err);
    }
    setLoading(false);
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
      const prompt = `
You are a medical assistant AI. A user has uploaded blood test values. Analyze the test results provided as JSON below.

Provide:
1. 🧪 Test Highlights (Name, Value, Normal Range, and Status)
2. 🧠 Insight Summary (in simple language)
3. ⚠️ Warnings for abnormal values
4. 💡 Suggestions for next steps

Data:
${JSON.stringify(formData, null, 2)}

Only return a clean and informative report for the user.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setSummary(response.text());
    } catch (err) {
      console.error("Gemini API Error:", err);
      setSummary("⚠️ Error generating summary");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📄 Upload Blood Report</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading} style={{ margin: "1rem 0" }}>
        {loading ? "Processing..." : "Upload"}
      </button>

      <h3>🧪 Verify Test Values</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={{ flex: "1 0 200px" }}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
              placeholder="Enter or verify value"
            />
          </div>
        ))}
      </div>

      <button onClick={handleGenerateSummary} disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Generating Summary..." : "Generate AI Summary"}
      </button>

      {summary && (
        <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
          <h3>🧠 AI Summary</h3>
          <div>{summary}</div>
        </div>
      )}
    </div>
  );
} 
