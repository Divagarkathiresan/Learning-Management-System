import React from "react";
// import "./Loader.css";

export default function Loader({ label, value, max = 1, color, ratio = 1 }) {
  const radius = 36;
  const stroke = 7;

  // Normalize progress safely
  const normalized = Math.max(0, Math.min(ratio, value / max));

  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - normalized);

  return (
    <div className="circular-loader">
      <svg width="80" height="80">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />

        {/* Value text */}
        <text
          x="40"
          y="46"
          textAnchor="middle"
          fontSize="1.1rem"
          fill="#23235b"
          fontWeight="bold"
        >
          {value}
        </text>
      </svg>

      <div className="loader-label">{label}</div>
    </div>
  );
}
