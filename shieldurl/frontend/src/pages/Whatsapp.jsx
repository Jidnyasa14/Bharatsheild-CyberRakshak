import { useState } from "react";
import RiskBadge from "../components/RiskBadge";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function extractUrls(text) {
  const regex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
  return [...new Set(text.match(regex) || [])];
}

export default function Whatsapp() {
  const [message,  setMessage]  = useState("");
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [scanned,  setScanned]  = useState(false);

  async function handleScan() {
    const urls = extractUrls(message);
    if (urls.length === 0) {
      setError("No URLs found in this message. Make sure the message contains links.");
      return;
    }
    setLoading(true);
    setResults([]);
    setError("");
    setScanned(false);

    const scanResults = await Promise.all(
      urls.map(async (url) => {
        try {
          const res  = await fetch(`${API}/api/analyze`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ url }),
          });
          return await res.json();
        } catch {
          return { url, riskLevel: "suspicious", ml: { score: 0.5, scam_type: "Unknown" }, error: true };
        }
      })
    );

    setResults(scanResults);
    setLoading(false);
    setScanned(true);
  }

  const dangerous  = results.filter(r => r.riskLevel === "dangerous").length;
  const suspicious = results.filter(r => r.riskLevel === "suspicious").length;
  const safe       = results.filter(r => r.riskLevel === "safe").length;

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-badge">💬 WhatsApp Protection</div>
        <h1>WhatsApp Link Scanner</h1>
        <p>Paste any WhatsApp message — we'll find and scan all links instantly</p>
      </div>

      <div className="wa-box">
        <div className="wa-header">
          <span>📱 Paste WhatsApp Message</span>
          <span className="wa-tip">Works with forwarded messages too!</span>
        </div>
        <textarea
          className="wa-input"
          placeholder={`Paste your WhatsApp message here...\n\nExample:\n"Congratulations! You won ₹50,000 in lucky draw!\nClaim now: http://paytm-reward.tk/claim\nOffer expires today!"`}
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={8}
        />

        {/* Show detected URLs live */}
        {message && extractUrls(message).length > 0 && (
          <div className="detected-urls">
            <span className="detected-label">🔍 URLs detected: {extractUrls(message).length}</span>
            {extractUrls(message).map(u => (
              <span key={u} className="detected-url">{u}</span>
            ))}
          </div>
        )}

        {error && <p className="error">⚠️ {error}</p>}

        <button className="scan-btn wa-scan-btn" onClick={handleScan} disabled={loading}>
          {loading ? "Scanning all links…" : "🔍 Scan All Links"}
        </button>
      </div>

      {/* Summary */}
      {scanned && results.length > 0 && (
        <>
          <div className="wa-summary">
            <div
  className={`wa-summary-card ${
    dangerous > 0
      ? "danger"
      : suspicious > 0
      ? "suspicious"
      : "safe"
  }`}
>
  <div className="wa-summary-icon">
    {dangerous > 0 ? "🚨" : suspicious > 0 ? "⚠️" : "✅"}
  </div>

  <div className="wa-summary-text">
    {suspicious > 0 && dangerous === 0 && (
  <p style={{ marginTop: "8px" }}>
    ⚠️ This message contains potentially unsafe links. Verify before clicking.
  </p>
)}
    <strong>
      {dangerous > 0
        ? "DANGER! This message contains scam links!"
        : suspicious > 0
        ? "Suspicious WhatsApp Message"
        : "Message looks safe"}
    </strong>

    <span>
      {dangerous} dangerous · {suspicious} suspicious · {safe} safe
    </span>
  </div>
</div> 
          </div>

          <div className="wa-results">
            {results.map((r, i) => (
              <div key={i} className={`wa-result-item ${r.riskLevel}`}>
                <div className="wa-result-header">
                  <RiskBadge level={r.riskLevel} />
                  <span className="wa-result-url">{r.url}</span>
                </div>
                <div className="wa-result-details">
                  <span>AI Score: <strong>{Math.round((r.ml?.score || 0) * 100)}%</strong></span>
                  {r.ml?.scam_type && r.ml.scam_type !== "None" && (
                    <span className="scam-type-pill">{r.ml.scam_type}</span>
                  )}
                </div>
                {r.riskLevel !== "safe" && (
                  <p className="wa-warning">
                    ⚠️ Do NOT click this link or enter any OTP/password/UPI PIN!
                  </p>
                )}
              </div>
            ))}
          </div>

          {dangerous > 0 && (
            <div className="report-box">
              <h3>🚨 You found a scam! Report it:</h3>
              <div className="report-links">
                <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="report-btn">
                  🌐 cybercrime.gov.in
                </a>
                <a href="tel:1930" className="report-btn green">
                  📞 Call 1930
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
