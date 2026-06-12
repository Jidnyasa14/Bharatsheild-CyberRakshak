from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle, re, os
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

# ── Indian scam keywords ─────────────────────────────────────────────
INDIAN_SCAM_WORDS = [
    "upi", "paytm", "phonepe", "gpay", "bhim",
    "uidai", "aadhar", "aadhaar", "pan-card", "pancard",
    "irctc", "railway", "epfo", "pf-account",
    "ration-card", "pm-kisan", "pmkisan",
    "tcs-hiring", "infosys-job", "wipro-offer",
    "ipl-win", "cricket-bet", "satta",
    "kyc-update", "kyc-verify", "sim-block",
    "prize-winner", "lucky-draw", "reward-claim",
    "income-tax-refund", "it-refund",
]

SUSPICIOUS_WORDS = [
    "login", "secure", "account", "update", "verify",
    "banking", "confirm", "password", "paypal", "signin",
    "free", "winner", "prize", "lucky", "reward",
    "urgent", "expire", "suspend", "block", "alert",
]

# ── Feature extraction ───────────────────────────────────────────────
def extract_features(url):
    parsed   = urlparse(url)
    hostname = parsed.hostname or ""
    path     = parsed.path or ""
    url_low  = url.lower()

    # Count Indian scam keywords
    indian_scam_count = sum(1 for w in INDIAN_SCAM_WORDS if w in url_low)
    suspicious_count  = sum(1 for w in SUSPICIOUS_WORDS  if w in url_low)

    # Suspicious TLDs used in Indian scams
    bad_tlds = [".tk", ".cf", ".ga", ".gq", ".ml", ".xyz", ".top",
                ".club", ".online", ".site", ".icu", ".buzz"]
    has_bad_tld = 1 if any(hostname.endswith(t) for t in bad_tlds) else 0

    # Fake Indian govt patterns
    govt_keywords = ["gov.in", "nic.in", "uidai", "irctc", "epfo", "incometax"]
    fake_govt = 1 if (
        any(k in url_low for k in govt_keywords) and
        not any(url_low.startswith(f"https://{k}") for k in govt_keywords)
    ) else 0

    features = {
        "url_length":          len(url),
        "has_ip":              1 if re.match(r'\d+\.\d+\.\d+\.\d+', hostname) else 0,
        "has_at_symbol":       1 if "@" in url else 0,
        "has_double_slash":    1 if "//" in path else 0,
        "num_dots":            url.count("."),
        "num_hyphens":         url.count("-"),
        "num_underscores":     url.count("_"),
        "num_slashes":         url.count("/"),
        "num_question_marks":  url.count("?"),
        "num_equals":          url.count("="),
        "num_percent":         url.count("%"),
        "is_https":            1 if parsed.scheme == "https" else 0,
        "hostname_length":     len(hostname),
        "path_length":         len(path),
        "num_subdomains":      hostname.count("."),
        "has_suspicious_word": 1 if suspicious_count > 0 else 0,
        "has_hex_chars":       1 if re.search(r'%[0-9a-fA-F]{2}', url) else 0,
        "digit_ratio":         sum(c.isdigit() for c in url) / max(len(url), 1),
        "indian_scam_count":   indian_scam_count,
        "has_bad_tld":         has_bad_tld,
        "fake_govt_site":      fake_govt,
        "suspicious_count":    suspicious_count,
    }
    return list(features.values())

# ── Training data with Indian scam URLs ─────────────────────────────
MODEL_PATH = "model.pkl"

def build_model():
    from sklearn.ensemble import RandomForestClassifier

    safe_urls = [
        "https://www.google.com",
        "https://github.com/user/repo",
        "https://www.irctc.co.in/nget/train-search",
        "https://www.incometax.gov.in/iec/foportal",
        "https://www.uidai.gov.in",
        "https://www.paytm.com/pay",
        "https://phonepe.com/en",
        "https://stackoverflow.com/questions/123",
        "https://www.amazon.in/product",
        "https://www.flipkart.com/item",
        "https://docs.python.org/3/",
        "https://en.wikipedia.org/wiki/India",
        "https://www.youtube.com/watch?v=abc",
        "https://twitter.com/user/status",
        "https://www.sbi.co.in/portal/web/home",
        "https://www.hdfcbank.com/personal",
    ]

    phish_urls = [
        # Western phishing
        "http://192.168.1.1/login/verify-account",
        "http://paypal-secure-login.tk/update.php",
        "http://amazon-account-verify.xyz/signin",
        "http://secure-banking-login.cf/confirm",
        "http://google.com.phishing-site.ru/login",
        # Indian UPI scams
        "http://paytm-reward-claim.tk/upi-prize",
        "http://phonepe-kyc-update.cf/verify-now",
        "http://gpay-lucky-winner.xyz/claim-prize",
        "http://bhim-upi-reward.ga/free-money",
        "http://paytm-cashback-offer.club/win",
        # Fake govt sites
        "http://uidai-aadhar-update.tk/kyc-verify",
        "http://irctc-refund-claim.cf/ticket-money",
        "http://pmkisan-beneficiary.xyz/claim-now",
        "http://income-tax-refund-gov.tk/apply",
        "http://epfo-pf-withdrawal.cf/apply-now",
        # Fake job offers
        "http://tcs-hiring-2024.tk/apply-now",
        "http://infosys-job-offer.cf/register",
        "http://wipro-work-from-home.xyz/join",
        # Fake prize/lottery
        "http://ipl-prize-winner-2024.tk/claim",
        "http://cricket-bet-win.cf/lucky-draw",
        "http://sim-block-alert-airtel.xyz/verify",
    ]

    X = [extract_features(u) for u in safe_urls + phish_urls]
    y = [0]*len(safe_urls) + [1]*len(phish_urls)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    print("✅ Indian scam model created!")
    return model

# Delete old model to retrain with new features
if os.path.exists(MODEL_PATH):
    os.remove(MODEL_PATH)
    print("Old model removed, retraining...")

model = build_model()

# ── Routes ──────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    url  = data.get("url", "").strip()
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    features    = extract_features(url)
    score       = float(model.predict_proba([features])[0][1])
    label       = "phishing" if score > 0.5 else "safe"
    url_low     = url.lower()

    # Detect Indian scam type
    scam_type = "None"
    if any(w in url_low for w in ["upi","paytm","phonepe","gpay","bhim"]):
        scam_type = "UPI/Payment Scam 💳"
    elif any(w in url_low for w in ["uidai","aadhar","pan","irctc","epfo","pmkisan"]):
        scam_type = "Fake Government Site 🏛️"
    elif any(w in url_low for w in ["tcs","infosys","wipro","job","hiring"]):
        scam_type = "Fake Job Offer 💼"
    elif any(w in url_low for w in ["ipl","cricket","bet","prize","lucky","winner"]):
        scam_type = "Lottery/Prize Scam 🎰"
    elif any(w in url_low for w in ["kyc","sim","block","suspend"]):
        scam_type = "KYC/SIM Scam 📱"

    return jsonify({
        "url":       url,
        "score":     round(score, 4),
        "label":     label,
        "scam_type": scam_type,
        "features":  {
            "url_length":        features[0],
            "is_https":          bool(features[11]),
            "has_ip":            bool(features[1]),
            "num_dots":          features[4],
            "suspicious_word":   bool(features[15]),
            "indian_scam":       features[18] > 0,
            "bad_tld":           bool(features[19]),
            "fake_govt":         bool(features[20]),
        }
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
