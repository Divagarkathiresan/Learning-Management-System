export default function Loader({ label, value, max, color,Value }) {
  const radius = 36;
  const stroke = 7;
  const normalized = Math.max(0, Math.min(Value, value / (max || 1)));
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - normalized);
  return (
    <div className="circular-loader">
      <svg width="80" height="80">
        <circle
          cx="40" cy="35" r={radius}
          stroke="#e5e7eb" strokeWidth={stroke} fill="none"
        />
        <circle
          cx="40" cy="40" r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s' }}
        />
        <text x="40" y="46" textAnchor="middle" fontSize="1.1rem" fill="#23235b" fontWeight="bold">
          {value}
        </text>
      </svg>
      <div className="loader-label">{label}</div>
    </div>
  );
}
