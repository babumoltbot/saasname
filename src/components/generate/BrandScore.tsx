interface Props {
  score: number;
  size?: "sm" | "lg";
  animated?: boolean;
}

export default function BrandScore({ score, size = "sm", animated }: Props) {
  const radius = size === "lg" ? 44 : 22;
  const strokeWidth = size === "lg" ? 4 : 3;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  const color =
    score >= 80
      ? "var(--color-accent)"
      : score >= 60
      ? "var(--color-warning)"
      : "#ef4444";

  const bgGlow =
    score >= 80
      ? "rgba(5, 150, 105, 0.08)"
      : score >= 60
      ? "rgba(217, 119, 6, 0.08)"
      : "rgba(239, 68, 68, 0.08)";

  return (
    <div
      className="relative flex items-center justify-center shrink-0 rounded-full"
      style={{ background: size === "lg" ? bgGlow : "transparent" }}
    >
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
          opacity={0.5}
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
          className={animated ? "score-circle-animated" : ""}
          style={
            animated
              ? ({
                  "--circumference": circumference,
                  "--offset": circumference - filled,
                } as React.CSSProperties)
              : undefined
          }
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
