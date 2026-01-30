"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconEye,
  IconEyeOff,
  IconShieldX,
  IconRefresh,
} from "@tabler/icons-react";
import {
  analyzePassword,
  type PasswordAnalysis,
} from "@/lib/password-strength";
import { CrackTimeDisplay, MetricsGrid } from "@/components";

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
        <header className="pt-10 pb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-4 glitch glow-green"
            data-text="HOW HACKABLE ARE YOU?"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            HOW HACKABLE ARE YOU?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4"
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            Test your password against{" "}
            <a
              href="https://dropbox.tech/security/zxcvbn-realistic-password-strength-estimation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-matrix-green hover:underline"
            >
              realistic password strength estimation techniques
            </a>{" "}
            to see how secure you really are?
            <span className="block text-warning-red font-bold">
              {" "}
              (Do NOT use your real passwords!)
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
                    className="w-full bg-transparent text-2xl md:text-3xl py-4 px-4 pr-32 text-matrix-green placeholder-gray-600 focus:outline-none"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                    autoComplete="off"
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <AnimatePresence>
                      {password && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          onClick={handleReset}
                          className="p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-warning-red group"
                          aria-label="Reset password"
                        >
                          <IconRefresh
                            size={28}
                            className="group-hover:rotate-180 transition-transform duration-500"
                          />
                        </motion.button>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-matrix-green"
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
              {analysis && (
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
        </section>

        <footer className="bottom-0 py-4 glass border-t border-(--matrix-green)/20">
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
                  className="hover:underline"
                >
                  ZeroDay Alliance
                </a>
              </span>
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
