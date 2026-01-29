import zxcvbn from "zxcvbn";

export interface PasswordAnalysis {
  score: number;
  crackTime: string;
  crackTimeDisplay: string;
  entropy: number;
  patterns: string[];
  complexity: number;
  uniqueness: number;
  strengthLevel: "critical" | "weak" | "medium" | "strong" | "fortress";
  suggestions: string[];
}

const COMMON_PASSWORDS = [
  "password",
  "password123",
  "123456",
  "qwerty",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "master",
  "123456789",
  "12345678",
  "1234567",
  "12345",
  "111111",
  "abc123",
  "password1",
  "iloveyou",
];

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      score: 0,
      crackTime: "0 seconds",
      crackTimeDisplay: "ENTER PASSWORD",
      entropy: 0,
      patterns: [],
      complexity: 0,
      uniqueness: 0,
      strengthLevel: "critical",
      suggestions: ["Start typing to analyze your password"],
    };
  }

  const result = zxcvbn(password);

  const isCommonPassword = COMMON_PASSWORDS.some(
    (common) => password.toLowerCase() === common.toLowerCase(),
  );

  const charsetSize = calculateCharsetSize(password);
  const entropy = Math.round(password.length * Math.log2(charsetSize));

  const patterns = extractPatterns(result);

  const complexity = calculateComplexity(password);

  const uniqueness = calculateUniqueness(password, result);

  let strengthLevel: PasswordAnalysis["strengthLevel"];
  let adjustedScore = result.score;

  if (isCommonPassword || password.toLowerCase() === "password123") {
    strengthLevel = "critical";
    adjustedScore = 0;
  } else if (result.score === 0) {
    strengthLevel = "critical";
  } else if (result.score === 1) {
    strengthLevel = "weak";
  } else if (result.score === 2) {
    strengthLevel = "medium";
  } else if (result.score === 3) {
    strengthLevel = "strong";
  } else {
    strengthLevel = "fortress";
  }

  const crackTimeDisplay = formatCrackTimeDisplay(
    result.crack_times_display.offline_slow_hashing_1e4_per_second as string,
    strengthLevel,
  );

  return {
    score: adjustedScore,
    crackTime: result.crack_times_display
      .offline_slow_hashing_1e4_per_second as string,
    crackTimeDisplay,
    entropy,
    patterns,
    complexity,
    uniqueness,
    strengthLevel,
    suggestions: result.feedback.suggestions,
  };
}

function calculateCharsetSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 32;
  return size || 1;
}

function extractPatterns(result: zxcvbn.ZXCVBNResult): string[] {
  const patterns: string[] = [];

  result.sequence.forEach((seq) => {
    switch (seq.pattern) {
      case "dictionary":
        if (seq.dictionary_name === "passwords") {
          patterns.push("Common Password");
        } else if (seq.dictionary_name === "english_wikipedia") {
          patterns.push("Dictionary Word");
        } else if (
          seq.dictionary_name === "surnames" ||
          seq.dictionary_name === "female_names" ||
          seq.dictionary_name === "male_names"
        ) {
          patterns.push("Common Name");
        } else {
          patterns.push(
            `${seq.dictionary_name?.replace("_", " ") || "Dictionary"}`,
          );
        }
        break;
      case "sequence":
        patterns.push(`Sequence (${seq.token})`);
        break;
      case "repeat":
        patterns.push(`Repeated Pattern`);
        break;
      case "date":
        patterns.push("Date Pattern");
        break;
      case "spatial":
        patterns.push("Keyboard Pattern");
        break;
      case "regex":
        patterns.push("Simple Pattern");
        break;
    }
  });

  return [...new Set(patterns)];
}

function calculateComplexity(password: string): number {
  let score = 0;

  score += Math.min(password.length * 4, 40);

  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  return Math.min(score, 100);
}

function calculateUniqueness(
  password: string,
  result: zxcvbn.ZXCVBNResult,
): number {
  let score = 100;

  score -= result.sequence.length * 15;

  if (
    COMMON_PASSWORDS.some((common) =>
      password.toLowerCase().includes(common.toLowerCase()),
    )
  ) {
    score -= 50;
  }

  const repeatedChars = password.match(/(.)\1{2,}/g);
  if (repeatedChars) {
    score -= repeatedChars.length * 10;
  }

  return Math.max(0, Math.min(100, score));
}

function formatCrackTimeDisplay(
  time: string,
  level: PasswordAnalysis["strengthLevel"],
): string {
  if (level === "critical") {
    return "INSTANTLY";
  }

  const timeUpper = time.toUpperCase();

  if (timeUpper.includes("CENTUR")) {
    return timeUpper
      .replace("CENTURIES", "CENTURIES")
      .replace("CENTURY", "CENTURY");
  }

  return timeUpper;
}

export function getStrengthColor(
  level: PasswordAnalysis["strengthLevel"],
): string {
  switch (level) {
    case "critical":
      return "var(--warning-red)";
    case "weak":
      return "var(--warning-red)";
    case "medium":
      return "var(--cyber-yellow)";
    case "strong":
      return "var(--matrix-green-dim)";
    case "fortress":
      return "var(--matrix-green)";
  }
}

export function getStrengthGradient(
  level: PasswordAnalysis["strengthLevel"],
): string {
  switch (level) {
    case "critical":
    case "weak":
      return "from-red-600 to-red-500";
    case "medium":
      return "from-yellow-500 to-amber-400";
    case "strong":
      return "from-green-600 to-green-500";
    case "fortress":
      return "from-green-400 to-emerald-300";
  }
}
