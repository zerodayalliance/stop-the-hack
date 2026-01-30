"use client";

export function MetricCard({
  title,
  value,
  description,
  isWarning = false,
}: {
  title: string;
  value: string;
  description: string;
  isWarning?: boolean;
}) {
  return (
    <div className="glass rounded-xl p-4 glass-hover transition-all duration-300">
      <h3
        className="text-xs font-bold text-gray-500 tracking-widest mb-1"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {title}
      </h3>
      <p className="text-xs text-gray-500 mb-2">{description}</p>
      <p
        className={`text-xl font-bold ${isWarning ? "text-cyber-yellow" : "text-matrix-green"}`}
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {value}
      </p>
    </div>
  );
}
