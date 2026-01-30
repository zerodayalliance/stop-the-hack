"use client";

import { motion } from "framer-motion";

export function ProgressCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "green" | "yellow" | "red";
}) {
  const colorMap = {
    green: "bg-[var(--matrix-green)]",
    yellow: "bg-[var(--cyber-yellow)]",
    red: "bg-[var(--warning-red)]",
  };

  const glowMap = {
    green: "0 0 10px var(--matrix-green)",
    yellow: "0 0 10px var(--cyber-yellow)",
    red: "0 0 10px var(--warning-red)",
  };

  return (
    <div className="glass rounded-xl p-5 glass-hover transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3
          className="text-xs font-bold text-gray-500 tracking-widest"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {title}
        </h3>
        <span
          className={`text-lg font-bold ${color === "green" ? "text-matrix-green" : color === "yellow" ? "text-cyber-yellow" : "text-warning-red"}`}
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {value}%
        </span>
      </div>
      <div className="progress-bar-bg rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${colorMap[color]}`}
          style={{ boxShadow: glowMap[color] }}
        />
      </div>
    </div>
  );
}
