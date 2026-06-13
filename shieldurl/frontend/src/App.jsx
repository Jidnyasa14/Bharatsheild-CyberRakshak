import { useState } from "react";
import Home     from "./pages/Home";
import History  from "./pages/History";
import Stats    from "./pages/Stats";
import Whatsapp from "./pages/Whatsapp";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="shield">🛡️</span>
          <div>
            <span className="brand-name">BharatShield-CyberRakshak</span>
            <span className="brand-tag">🇮🇳 Protecting Indians Online</span>
          </div>
        </div>
        <div className="nav-links">
          {[
            { id: "home",      label: "🔍 Scan URL" },
            { id: "whatsapp",  label: "💬 WhatsApp Scanner" },
            { id: "history",   label: "📜 History" },
            { id: "stats",     label: "📊 Stats" },
          ].map(p => (
            <button
              key={p.id}
              className={`nav-btn ${page === p.id ? "active" : ""}`}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {page === "home"      && <Home />}
        {page === "whatsapp"  && <Whatsapp />}
        {page === "history"   && <History />}
        {page === "stats"     && <Stats />}
      </main>

      <footer className="footer">
        <p>🛡️ BharatShield-CyberRakshak — Built to protect Indians from cyber scams</p>
        <p className="footer-sub">If you've been scammed call: <strong>1930</strong> (National Cyber Crime Helpline)</p>
      </footer>
    </div>
  );
}
