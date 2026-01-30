"use client";

import { type PasswordAnalysis } from "@/lib/password-strength";
import { MetricCard } from "./MetricCard";
import { ProgressCard } from "./ProgressCard";

export function MetricsGrid({ analysis }: { analysis: PasswordAnalysis }) {
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
