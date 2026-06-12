export default function RiskBadge({ level, large }) {
  const map = {
    safe:       { emoji: "✅", label: "Safe",       bg: "#dcfce7", color: "#166534" },
    suspicious: { emoji: "⚠️", label: "Suspicious", bg: "#fef9c3", color: "#854d0e" },
    dangerous:  { emoji: "🚨", label: "Dangerous",  bg: "#fee2e2", color: "#991b1b" },
  };
  const { emoji, label, bg, color } = map[level] || map.suspicious;

  return (
    <span
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          "6px",
        background:   bg,
        color,
        borderRadius: "8px",
        padding:      large ? "8px 20px" : "4px 12px",
        fontWeight:   600,
        fontSize:     large ? "18px" : "13px",
      }}
    >
      {emoji} {label}
    </span>
  );
}
