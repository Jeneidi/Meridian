/**
 * Security scanning using grep/regex patterns (surface-level, instant, free)
 * Scans file paths and README content for common security red flags
 */

export type Severity = "critical" | "high" | "medium" | "low";

export interface ScanIssue {
  type: string;
  description: string;
  pattern: string;
  severity: Severity;
  file?: string;
  line?: string;
}

export interface SecurityScanResult {
  issues: ScanIssue[];
  scannedFiles: number;
  scannedAt: string;
}

// Patterns to check against file paths and names
const FILE_PATTERNS: Array<{
  type: string;
  pattern: RegExp;
  description: string;
  severity: Severity;
}> = [
  {
    type: "exposed_env",
    pattern: /\.env(?!\.example|\.sample|\.template)/i,
    description: "Potential .env file committed to repository",
    severity: "critical",
  },
  {
    type: "private_key",
    pattern: /\.(pem|key|p12|pfx)$/i,
    description: "Private key or certificate file detected",
    severity: "critical",
  },
  {
    type: "secrets_file",
    pattern: /(secret|credential|password|token|apikey)s?\.(json|yml|yaml|txt|conf)/i,
    description: "File with sensitive name in repository",
    severity: "high",
  },
  {
    type: "database_dump",
    pattern: /\.(sql|dump|bak)$/i,
    description: "Database dump or backup file",
    severity: "high",
  },
];

// Patterns to check against README and issue content
const CONTENT_PATTERNS: Array<{
  type: string;
  pattern: RegExp;
  description: string;
  severity: Severity;
}> = [
  {
    type: "api_key_exposed",
    pattern: /sk-ant-[a-zA-Z0-9]{20,}/,
    description: "Anthropic API key pattern detected in content",
    severity: "critical",
  },
  {
    type: "openai_key",
    pattern: /sk-[a-zA-Z0-9]{48}/,
    description: "OpenAI API key pattern detected",
    severity: "critical",
  },
  {
    type: "github_token",
    pattern: /ghp_[a-zA-Z0-9]{36}/,
    description: "GitHub personal access token pattern detected",
    severity: "critical",
  },
  {
    type: "aws_key",
    pattern: /AKIA[0-9A-Z]{16}/,
    description: "AWS access key ID pattern detected",
    severity: "critical",
  },
  {
    type: "hardcoded_password",
    pattern: /password\s*[:=]\s*['"][^'"]{6,}['"]/i,
    description: "Hardcoded password value detected",
    severity: "high",
  },
  {
    type: "sql_injection_risk",
    pattern: /\$\{.*?\}.*?(?:SELECT|INSERT|UPDATE|DELETE|DROP)/i,
    description: "Potential SQL injection via template literal",
    severity: "high",
  },
  {
    type: "xss_risk",
    pattern: /dangerouslySetInnerHTML|innerHTML\s*=/,
    description: "Potential XSS via raw HTML injection",
    severity: "medium",
  },
  {
    type: "eval_usage",
    pattern: /\beval\s*\(/,
    description: "Use of eval() - potential code injection",
    severity: "medium",
  },
];

/**
 * Run a surface-level security scan using regex patterns
 * Fast, free, no API calls required
 */
export function runSecurityScan(
  fileTree: Array<{ name: string; type: string; path: string }>,
  textContent: string // README + issue titles concatenated
): SecurityScanResult {
  const issues: ScanIssue[] = [];

  // Check file paths
  for (const file of fileTree) {
    for (const check of FILE_PATTERNS) {
      if (check.pattern.test(file.path)) {
        issues.push({
          type: check.type,
          description: check.description,
          pattern: check.pattern.toString(),
          severity: check.severity,
          file: file.path,
        });
      }
    }
  }

  // Check text content
  for (const check of CONTENT_PATTERNS) {
    if (check.pattern.test(textContent)) {
      issues.push({
        type: check.type,
        description: check.description,
        pattern: check.pattern.toString(),
        severity: check.severity,
      });
    }
  }

  return {
    issues,
    scannedFiles: fileTree.length,
    scannedAt: new Date().toISOString(),
  };
}
