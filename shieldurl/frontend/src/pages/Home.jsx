import { useState } from "react";
import RiskBadge  from "../components/RiskBadge";
import ScoreGauge from "../components/ScoreGauge";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const EXAMPLE_URLS = [
  { url: "https://www.google.com",                    label: "✅ Safe site" },
  { url: "http://paytm-reward-claim.tk/upi-prize",    label: "🚨 UPI Scam" },
  { url: "http://uidai-aadhar-update.tk/kyc-verify",  label: "🚨 Fake Govt" },
  { url: "http://tcs-hiring-2024.tk/apply-now",       label: "🚨 Fake Job" },
];

export default function Home() {
  const [url,     setUrl]     = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleScan(scanUrl) {
    const target = scanUrl || url.trim();
    if (!target) return;
    setUrl(target);
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res  = await fetch(`${API}/api/analyze`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: target }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not reach the server. Make sure all 3 terminals are running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-badge">🇮🇳 Made for India</div>
        <h1>Is this URL safe?</h1>
        <p>Detects UPI scams, fake government sites, fake job offers, and phishing links targeting Indians</p>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-pill">🔴 4,000+ Indians scammed daily</div>
        <div className="stat-pill">💸 ₹1.25 lakh crore lost in 2023</div>
        <div className="stat-pill">📱 70% scams via WhatsApp links</div>
      </div>

      <div className="scan-box">
        <div className="input-row">
          <input
            className="url-input"
            type="text"
            placeholder="Paste any suspicious URL here..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleScan()}
          />
          <button className="scan-btn" onClick={() => handleScan()} disabled={loading}>
            {loading ? "Scanning…" : "🔍 Scan"}
          </button>
        </div>
        {error && <p className="error">⚠️ {error}</p>}

        {/* Example URLs */}
        <div className="examples">
          <span className="examples-label">Try these:</span>
          {EXAMPLE_URLS.map(e => (
            <button key={e.url} className="example-btn" onClick={() => handleScan(e.url)}>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="result-card">
          <div className="result-header">
            <RiskBadge level={result.riskLevel} large />
            <p className="result-url">{result.url}</p>
          </div>

          {/* Indian scam type banner */}
          {result.ml?.scam_type && result.ml.scam_type !== "None" && (
            <div className="scam-banner">
              ⚠️ Scam Type Detected: <strong>{result.ml.scam_type}</strong>
            </div>
          )}

          <div className="result-grid">
            <div className="result-section">
              <h3>AI Phishing Score</h3>
              <ScoreGauge score={result.ml.score} />
              <div className="feature-list">
                <FeatureRow label="HTTPS"           value={result.ml.features?.is_https    ? "✅ Yes" : "❌ No"} />
                <FeatureRow label="IP in URL"       value={result.ml.features?.has_ip      ? "⚠️ Yes" : "✅ No"} />
                <FeatureRow label="Suspicious word" value={result.ml.features?.suspicious_word ? "⚠️ Yes" : "✅ No"} />
                <FeatureRow label="Indian scam keyword" value={result.ml.features?.indian_scam ? "🚨 Yes" : "✅ No"} />
                <FeatureRow label="Dangerous domain (.tk/.cf)" value={result.ml.features?.bad_tld ? "🚨 Yes" : "✅ No"} />
                <FeatureRow label="Fake govt site"  value={result.ml.features?.fake_govt   ? "🚨 Yes" : "✅ No"} />
              </div>
            </div>

            <div className="result-section">
              <h3>VirusTotal Engines</h3>
              <div className="vt-score">
                <span className={`vt-number ${result.virustotal.positives > 0 ? "red" : "green"}`}>
                  {result.virustotal.positives}
                </span>
                <span className="vt-label">/ {result.virustotal.total || "—"} engines flagged</span>
              </div>
              <p className="vt-note">
                {result.virustotal.total === 0
                  ? "Add VirusTotal API key in backend/.env to enable."
                  : result.virustotal.positives === 0
                    ? "✅ No engines detected threats."
                    : `🚨 ${result.virustotal.positives} engines flagged this URL.`}
              </p>

              {/* Safety tips */}
              <div className="safety-tips">
                <h4>🛡️ Safety Tips</h4>
                {result.riskLevel === "safe"
                  ? <p className="tip safe">This URL appears safe. Still be cautious before entering personal details.</p>
                  : result.riskLevel === "suspicious"
                    ? <p className="tip warn">Be careful! Do not enter OTP, password, or UPI PIN on this site.</p>
                    : <p className="tip danger">Do NOT visit this site! Report to cybercrime.gov.in or call 1930.</p>
                }
              </div>
            </div>

            <div className="result-section">
              <h3>Server Location</h3>
              <div className="ip-info">
                <FeatureRow label="IP"      value={result.ip?.ip      || "N/A"} />
                <FeatureRow label="Country" value={result.ip?.country || "N/A"} />
                <FeatureRow label="City"    value={result.ip?.city    || "N/A"} />
                <FeatureRow label="Org"     value={result.ip?.org     || "N/A"} />
              </div>
              {result.ip?.country && result.ip.country !== "IN" && result.riskLevel !== "safe" && (
                <p className="foreign-warning">⚠️ Server is outside India — suspicious for Indian services!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureRow({ label, value }) {
  return (
    <div className="feature-row">
      <span className="feature-label">{label}</span>
      <span className="feature-value">{String(value)}</span>
    </div>
  );
}
