export default function ScoreGauge({ score }) {
  const pct   = Math.round(score * 100);
  const color = score > 0.7 ? "#ef4444" : score > 0.4 ? "#f59e0b" : "#22c55e";
  const r     = 40;
  const circ  = 2 * Math.PI * r;
  const dash  = circ - (circ * pct) / 100;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "12px 0" }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{pct}%</text>
        <text x="50" y="62" textAnchor="middle" fontSize="10" fill="#6b7280">phishing</text>
      </svg>
      <div>
        <p style={{ margin: 0, fontWeight: 600, color }}>
          {pct >= 70 ? "High risk" : pct >= 40 ? "Moderate risk" : "Low risk"}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
          {pct >= 70 ? "Likely phishing or malware" : pct >= 40 ? "Some suspicious signals" : "Looks clean"}
        </p>
      </div>
    </div>
  );
}
