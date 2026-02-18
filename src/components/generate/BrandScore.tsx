interface Props {
  score: number;
  size?: "sm" | "lg";
}

export default function BrandScore({ score, size = "sm" }: Props) {
  const radius = size === "lg" ? 40 : 22;
  const strokeWidth = size === "lg" ? 5 : 3;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  const color =
    score >= 80 ? "var(--color-accent)" : score >= 60 ? "var(--color-warning)" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`absolute font-[family-name:var(--font-mono)] font-bold ${
          size === "lg" ? "text-xl" : "text-xs"
        }`}
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
