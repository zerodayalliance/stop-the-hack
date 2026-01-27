"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconEye,
  IconEyeOff,
  IconShieldCheck,
  IconShieldX,
  IconAlertTriangle,
  IconRefresh,
  IconLock,
} from "@tabler/icons-react";
import {
  analyzePassword,
  type PasswordAnalysis,
  getStrengthColor,
} from "@/lib/password-strength";

export default function Home() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [isCriticalFlash, setIsCriticalFlash] = useState(false);
  const [hasTriggeredCritical, setHasTriggeredCritical] = useState(false);

  useEffect(() => {
    const result = analyzePassword(password);
    setAnalysis(result);

    if (password.toLowerCase() === "password" && !hasTriggeredCritical) {
      setIsCriticalFlash(true);
      setHasTriggeredCritical(true);
      setTimeout(() => setIsCriticalFlash(false), 1500);
    }
  }, [password, hasTriggeredCritical]);

  const handleReset = useCallback(() => {
    setPassword("");
    setShowPassword(false);
    setAnalysis(null);
    setHasTriggeredCritical(false);
  }, []);

  return (
    <div
      className={`min-h-screen relative ${isCriticalFlash ? "critical-flash" : ""}`}
    >
      <div className="scanlines" />

      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <main className="relative z-10 min-h-screen flex flex-col">
        <header className="pt-12 pb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-4 glitch glow-green"
            data-text="HOW HACKABLE ARE YOU?"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            HOW HACKABLE ARE YOU?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            Test your password against our AI.
            <span className="text-warning-red font-bold">
              {" "}
              (Do NOT use your real banking password!)
            </span>
          </motion.p>
        </header>

        <section className="flex-1 flex flex-col items-center justify-start px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <div className="relative mb-8">
              <div className="glass rounded-2xl p-2 neon-border">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER PASSWORD TO ANALYZE..."
                    className="w-full bg-transparent text-2xl md:text-3xl py-6 px-6 pr-16 text-matrix-green placeholder-gray-600 focus:outline-none"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                    autoComplete="off"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-matrix-green"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <IconEyeOff size={28} />
                    ) : (
                      <IconEye size={28} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {analysis && (
                <motion.div
                  key={analysis.strengthLevel}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <CrackTimeDisplay analysis={analysis} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {analysis && password && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <MetricsGrid analysis={analysis} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleReset}
            className="mt-8 group flex items-center gap-3 px-8 py-4 glass rounded-xl hover:neon-border transition-all duration-300"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            <IconRefresh
              size={24}
              className="text-matrix-green group-hover:rotate-180 transition-transform duration-500"
            />
            <span className="text-lg font-bold tracking-wider text-gray-300 group-hover:text-matrix-green transition-colors">
              RESET TERMINAL
            </span>
          </motion.button>
        </section>

        <footer className="sticky bottom-0 py-4 glass border-t border-(--matrix-green)/20">
          <div className="text-center">
            <p
              className="text-sm text-gray-500 tracking-widest"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              Built by{" "}
              <span className="text-matrix-green font-bold">
                <a
                  href="https://zerodayalliance.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ZeroDay Alliance
                </a>
              </span>{" "}
              | <span className="text-gray-400">SNU, Kolkata</span>
            </p>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {isCriticalFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <IconShieldX
                size={120}
                className="mx-auto text-warning-red mb-4 glow-red"
              />
              <h2
                className="text-4xl md:text-6xl font-black text-warning-red glow-red glitch"
                data-text="CRITICAL VULNERABILITY"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                CRITICAL VULNERABILITY
              </h2>
              <p
                className="text-xl text-red-300 mt-4"
                style={{ fontFamily: "var(--font-jetbrains), monospace" }}
              >
                This password is in every hacker's dictionary!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CrackTimeDisplay({ analysis }: { analysis: PasswordAnalysis }) {
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
      className={`glass rounded-2xl p-6 md:p-8 bg-linear-to-br ${getBackgroundClass()} border-2`}
    >
      <div className="flex items-center justify-center gap-4 mb-4">
        <motion.div
          animate={{
            rotate: analysis.strengthLevel === "fortress" ? [0, 360] : 0,
            scale: analysis.strengthLevel === "critical" ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: analysis.strengthLevel === "fortress" ? 3 : 0.5,
            repeat: analysis.strengthLevel === "fortress" ? Infinity : 0,
            ease: "linear",
          }}
        >
          {getIcon()}
        </motion.div>
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
        className={`text-4xl md:text-6xl font-black text-center ${getGlowClass()} pulse-glow`}
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          color: getStrengthColor(analysis.strengthLevel),
        }}
      >
        {analysis.crackTimeDisplay}
      </motion.div>

      {analysis.strengthLevel === "fortress" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-4"
        >
          <IconLock size={32} className="text-matrix-green animate-pulse" />
        </motion.div>
      )}
    </div>
  );
}

function MetricsGrid({ analysis }: { analysis: PasswordAnalysis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricCard
        title="ENTROPY SCORE"
        value={`${analysis.entropy} bits`}
        description="Randomness measure"
      />

      <MetricCard
        title="PATTERNS DETECTED"
        value={
          analysis.patterns.length > 0
            ? analysis.patterns.slice(0, 2).join(", ")
            : "None Found"
        }
        description={
          analysis.patterns.length > 2
            ? `+${analysis.patterns.length - 2} more`
            : "Weakness analysis"
        }
        isWarning={analysis.patterns.length > 0}
      />

      <ProgressCard
        title="COMPLEXITY"
        value={analysis.complexity}
        color={
          analysis.complexity > 70
            ? "green"
            : analysis.complexity > 40
              ? "yellow"
              : "red"
        }
      />

      <ProgressCard
        title="UNIQUENESS"
        value={analysis.uniqueness}
        color={
          analysis.uniqueness > 70
            ? "green"
            : analysis.uniqueness > 40
              ? "yellow"
              : "red"
        }
      />
    </div>
  );
}

function MetricCard({
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
    <div className="glass rounded-xl p-5 glass-hover transition-all duration-300">
      <h3
        className="text-xs font-bold text-gray-500 tracking-widest mb-2"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {title}
      </h3>
      <p
        className={`text-xl font-bold truncate ${isWarning ? "text-cyber-yellow" : "text-matrix-green"}`}
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function ProgressCard({
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
