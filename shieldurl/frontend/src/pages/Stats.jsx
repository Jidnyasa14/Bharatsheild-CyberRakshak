import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Stats() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/stats`)
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(()  => setLoading(false));
  }, []);

  if (loading || !stats) return <div className="page"><p>Loading stats…</p></div>;

  const pct = (n) => stats.total ? Math.round((n / stats.total) * 100) : 0;

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        <StatCard label="Total Scans"   value={stats.total}     color="#3b82f6" />
        <StatCard label="Dangerous"     value={stats.dangerous}  color="#ef4444" />
        <StatCard label="Suspicious"    value={stats.suspicious} color="#f59e0b" />
        <StatCard label="Safe"          value={stats.safe}       color="#22c55e" />
      </div>

      <div className="bar-section">
        <h3>Threat breakdown</h3>
        <BarRow label="Safe"       pct={pct(stats.safe)}       color="#22c55e" />
        <BarRow label="Suspicious" pct={pct(stats.suspicious)} color="#f59e0b" />
        <BarRow label="Dangerous"  pct={pct(stats.dangerous)}  color="#ef4444" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-number" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function BarRow({ label, pct, color }) {
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="bar-pct">{pct}%</span>
    </div>
  );
}
