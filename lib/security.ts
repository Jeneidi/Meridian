/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize string input to prevent XSS
 * Removes HTML-like characters but preserves newlines and spaces
 */
export function sanitizeInput(input: string, maxLength: number = 5000): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .slice(0, maxLength) // Limit length
    .trim()
    .replace(/[<>]/g, ""); // Remove angle brackets
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate GitHub repository name format
 */
export function isValidGitHubRepo(fullName: string): boolean {
  const repoRegex = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
  return repoRegex.test(fullName);
}

/**
 * Validate that a URL is HTTPS (for external links)
 */
export function isHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Trim and validate a git diff
 * Removes potential injection vectors
 */
export function sanitizeDiff(diff: string, maxLength: number = 2000): string {
  if (typeof diff !== "string") {
    return "";
  }

  // Trim to max length
  const trimmed = diff.slice(0, maxLength).trim();

  // Remove null bytes
  return trimmed.replace(/\0/g, "");
}

/**
 * List of forbidden keywords in user input (for basic protection)
 */
const FORBIDDEN_KEYWORDS = [
  "<script",
  "javascript:",
  "onerror=",
  "onload=",
  "onclick=",
  "onmouse",
];

/**
 * Check if input contains potentially malicious content
 */
export function containsMaliciousContent(input: string): boolean {
  const lower = input.toLowerCase();
  return FORBIDDEN_KEYWORDS.some((keyword) => lower.includes(keyword));
}

/**
 * Validate task data structure
 */
export function isValidTaskData(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;

  const task = data as Record<string, unknown>;
  return (
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    (task.estimate === 30 || task.estimate === 60) &&
    typeof task.difficulty === "number" &&
    task.difficulty >= 1 &&
    task.difficulty <= 5 &&
    typeof task.priority === "number" &&
    task.priority >= 1 &&
    task.priority <= 10 &&
    Array.isArray(task.files) &&
    Array.isArray(task.microSteps)
  );
}
