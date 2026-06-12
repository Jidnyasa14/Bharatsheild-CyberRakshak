const express = require("express");
const cors    = require("cors");
const axios   = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB Connection Failed");
  console.error(err);
});

// ── Scan schema ──────────────────────────────────────────────────────
const scanSchema = new mongoose.Schema({
  url:        String,
  mlScore:    Number,
  mlLabel:    String,
  vtPositives: Number,
  vtTotal:    Number,
  ipCountry:  String,
  ipOrg:      String,
  riskLevel:  String,   // "safe" | "suspicious" | "dangerous"
  scannedAt:  { type: Date, default: Date.now },
});
const Scan = mongoose.model("Scan", scanSchema);

// ── Helpers ──────────────────────────────────────────────────────────
function getRiskLevel(mlScore, vtPositives) {
  if (mlScore > 0.7 || vtPositives > 3) return "dangerous";
  if (mlScore > 0.4 || vtPositives > 0) return "suspicious";
  return "safe";
}

async function callML(url) {
  try {
    const res = await axios.post(
      process.env.ML_URL || "http://localhost:5001/predict",
      { url }, { timeout: 5000 }
    );
    return res.data;
  } catch {
    return { score: 0, label: "unknown", features: {} };
  }
}

async function callVirusTotal(url) {
  const VT_KEY = process.env.VIRUSTOTAL_API_KEY;
  if (!VT_KEY) return { positives: 0, total: 0 };
  try {
    // Submit URL for scan
    await axios.post(
      "https://www.virustotal.com/vtapi/v2/url/scan",
      new URLSearchParams({ apikey: VT_KEY, url }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    // Fetch report
    const report = await axios.get(
      "https://www.virustotal.com/vtapi/v2/url/report",
      { params: { apikey: VT_KEY, resource: url } }
    );
    return {
      positives: report.data.positives || 0,
      total:     report.data.total     || 0,
    };
  } catch {
    return { positives: 0, total: 0 };
  }
}

async function callIPInfo(url) {
  try {
    const { hostname } = new URL(url);
    const dns = await import("dns").then(m => m.promises);
    const addresses = await dns.lookup(hostname);
    const ip = addresses.address;

    const res = await axios.get(
      `https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN || ""}`,
      { timeout: 3000 }
    );
    return {
      ip:      ip,
      country: res.data.country || "Unknown",
      org:     res.data.org     || "Unknown",
      city:    res.data.city    || "",
    };
  } catch {
    return { ip: "", country: "Unknown", org: "Unknown", city: "" };
  }
}

// ── Routes ───────────────────────────────────────────────────────────

// POST /api/analyze  — main scan endpoint
app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  // Run all 3 checks in parallel
  const [ml, vt, ip] = await Promise.all([
    callML(url),
    callVirusTotal(url),
    callIPInfo(url),
  ]);

  const riskLevel = getRiskLevel(ml.score, vt.positives);

  const scan = await Scan.create({
    url,
    mlScore:     ml.score,
    mlLabel:     ml.label,
    vtPositives: vt.positives,
    vtTotal:     vt.total,
    ipCountry:   ip.country,
    ipOrg:       ip.org,
    riskLevel,
  });

  res.json({
    id:        scan._id,
    url,
    riskLevel,
    ml:        { score: ml.score, label: ml.label, features: ml.features },
    virustotal:{ positives: vt.positives, total: vt.total },
    ip,
    scannedAt: scan.scannedAt,
  });
});

// GET /api/history  — past scans
app.get("/api/history", async (req, res) => {
  const scans = await Scan.find().sort({ scannedAt: -1 }).limit(50);
  res.json(scans);
});

// GET /api/stats  — dashboard numbers
app.get("/api/stats", async (req, res) => {
  const [total, dangerous, suspicious, safe] = await Promise.all([
    Scan.countDocuments(),
    Scan.countDocuments({ riskLevel: "dangerous" }),
    Scan.countDocuments({ riskLevel: "suspicious" }),
    Scan.countDocuments({ riskLevel: "safe" }),
  ]);
  res.json({ total, dangerous, suspicious, safe });
});

// GET /api/health
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
