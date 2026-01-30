"use client";

import { motion } from "framer-motion";
import {
  IconShieldCheck,
  IconShieldX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import {
  type PasswordAnalysis,
  getStrengthColor,
} from "@/lib/password-strength";

export function CrackTimeDisplay({ analysis }: { analysis: PasswordAnalysis }) {
  const getBackgroundClass = () => {
    switch (analysis.strengthLevel) {
      case "critical":
      case "weak":
        return "from-red-950/50 to-red-900/30 border-[var(--warning-red)]";
      case "medium":
        return "from-yellow-950/50 to-amber-900/30 border-[var(--cyber-yellow)]";
      case "strong":
      case "fortress":
        return "from-green-950/50 to-emerald-900/30 border-[var(--matrix-green)]";
    }
  };

  const getIcon = () => {
    switch (analysis.strengthLevel) {
      case "critical":
      case "weak":
        return <IconShieldX size={48} className="text-warning-red" />;
      case "medium":
        return <IconAlertTriangle size={48} className="text-cyber-yellow" />;
      case "strong":
      case "fortress":
        return <IconShieldCheck size={48} className="text-matrix-green" />;
    }
  };

  const getGlowClass = () => {
    switch (analysis.strengthLevel) {
      case "critical":
      case "weak":
        return "glow-red";
      case "medium":
        return "glow-yellow";
      case "strong":
      case "fortress":
        return "glow-green";
    }
  };

  return (
    <div
      className={`glass rounded-2xl p-2 md:p-4 bg-linear-to-br ${getBackgroundClass()} border-2`}
    >
      <div className="flex items-center justify-center gap-4 mb-4">
        <motion.div>{getIcon()}</motion.div>
        <h2
          className="text-xl md:text-2xl font-bold text-gray-400 tracking-wider"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          TIME TO CRACK
        </h2>
      </div>

      <motion.div
        key={analysis.crackTimeDisplay}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`text-3xl md:text-5xl font-black text-center ${getGlowClass()} pulse-glow`}
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          color: getStrengthColor(analysis.strengthLevel),
        }}
      >
        {analysis.crackTimeDisplay}
      </motion.div>
    </div>
  );
}
