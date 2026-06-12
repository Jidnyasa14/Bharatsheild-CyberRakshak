import { useState, useEffect } from "react";
import RiskBadge from "../components/RiskBadge";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function History() {
  const [scans,   setScans]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/history`)
      .then(r => r.json())
      .then(data => { setScans(data); setLoading(false); })
      .catch(()  => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p>Loading history…</p></div>;

  return (
    <div className="page">
      <h2 className="page-title">Scan History</h2>
      {scans.length === 0
        ? <p>No scans yet. Go scan something!</p>
        : (
          <div className="table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Risk</th>
                  <th>ML Score</th>
                  <th>VT Flags</th>
                  <th>Country</th>
                  <th>Scanned</th>
                </tr>
              </thead>
              <tbody>
                {scans.map(s => (
                  <tr key={s._id}>
                    <td className="url-cell" title={s.url}>
                      {s.url.length > 45 ? s.url.slice(0, 45) + "…" : s.url}
                    </td>
                    <td><RiskBadge level={s.riskLevel} /></td>
                    <td>{(s.mlScore * 100).toFixed(0)}%</td>
                    <td>{s.vtPositives} / {s.vtTotal || "—"}</td>
                    <td>{s.ipCountry || "—"}</td>
                    <td>{new Date(s.scannedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}
