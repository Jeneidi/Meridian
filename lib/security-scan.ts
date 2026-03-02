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
  // ===== SECRETS & CREDENTIALS (CRITICAL) =====
  {
    type: "exposed_env",
    pattern: /\.env(?!\.example|\.sample|\.template|\.local)/i,
    description: "Potential .env file committed to repository",
    severity: "critical",
  },
  {
    type: "env_secrets",
    pattern: /\.env\.secrets|\.env\.production|\.env\.live/i,
    description: "Environment secrets file detected",
    severity: "critical",
  },
  {
    type: "private_key",
    pattern: /\.(pem|key|p12|pfx|jks|pkcs12)$/i,
    description: "Private key or certificate file detected",
    severity: "critical",
  },
  {
    type: "rsa_key",
    pattern: /rsa.*key|id_rsa|\.ssh/i,
    description: "SSH or RSA private key detected",
    severity: "critical",
  },
  {
    type: "secrets_file",
    pattern: /(secret|credential|password|token|apikey|api_key|access_token)s?\.(json|yml|yaml|txt|conf|env|xml|properties)/i,
    description: "File with sensitive name in repository",
    severity: "high",
  },
  {
    type: "vault_secrets",
    pattern: /vault|secrets\.yml|secrets\.yaml|secrets\.json/i,
    description: "Vault or secrets management file detected",
    severity: "high",
  },

  // ===== DATABASE & BACKUPS (HIGH) =====
  {
    type: "database_dump",
    pattern: /\.(sql|dump|bak|backup|restore|export|backup_db)$/i,
    description: "Database dump or backup file",
    severity: "high",
  },
  {
    type: "database_file",
    pattern: /\.db|\.sqlite|\.sqlite3|\.mdb|\.accdb/i,
    description: "Database file detected",
    severity: "high",
  },

  // ===== CONFIG FILES (HIGH) =====
  {
    type: "aws_credentials",
    pattern: /\.aws\/credentials|aws_access_key|aws_secret/i,
    description: "AWS credentials file detected",
    severity: "critical",
  },
  {
    type: "docker_config",
    pattern: /\.docker\/config\.json|dockerfile\.secrets/i,
    description: "Docker configuration with potential credentials detected",
    severity: "high",
  },
  {
    type: "kube_secrets",
    pattern: /k8s|kubernetes|secrets\.yml|kubeconfig|\.kube\/config/i,
    description: "Kubernetes or container secrets file detected",
    severity: "high",
  },
  {
    type: "terraform_tfvars",
    pattern: /\.tfvars|terraform\.tfvars\.secret/i,
    description: "Terraform variables file (may contain sensitive data)",
    severity: "high",
  },

  // ===== LOGS & DEBUG (MEDIUM/HIGH) =====
  {
    type: "sensitive_logs",
    pattern: /debug\.log|\.log|error\.log|access\.log|production\.log/i,
    description: "Log file detected (may contain sensitive data)",
    severity: "medium",
  },

  // ===== DEVELOPMENT ARTIFACTS (MEDIUM) =====
  {
    type: "git_exposed",
    pattern: /\.git\/|\.git$|GIT_IGNORE/i,
    description: ".git folder or git metadata exposed",
    severity: "medium",
  },
  {
    type: "npm_packages",
    pattern: /package-lock\.json|node_modules/i,
    description: "Dependency files or modules committed (version control risk)",
    severity: "low",
  },
  {
    type: "sourcemap_exposed",
    pattern: /\.js\.map|\.ts\.map|\.css\.map/,
    description: "Source map files exposed (reveals original source code)",
    severity: "medium",
  },
];

// Patterns to check against README and issue content
const CONTENT_PATTERNS: Array<{
  type: string;
  pattern: RegExp;
  description: string;
  severity: Severity;
}> = [
  // ===== API KEYS & CREDENTIALS (CRITICAL) =====
  {
    type: "api_key_anthropic",
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
    type: "github_oauth_token",
    pattern: /ghu_[a-zA-Z0-9]{36}/,
    description: "GitHub OAuth token detected",
    severity: "critical",
  },
  {
    type: "aws_access_key",
    pattern: /AKIA[0-9A-Z]{16}/,
    description: "AWS access key ID pattern detected",
    severity: "critical",
  },
  {
    type: "aws_secret_key",
    pattern: /aws_secret_access_key\s*[:=]\s*['"][^'"]{40}['"]/i,
    description: "AWS secret access key pattern detected",
    severity: "critical",
  },
  {
    type: "stripe_api_key",
    pattern: /(sk|rk)_live_[a-zA-Z0-9]{24,}/,
    description: "Stripe API key (live) detected",
    severity: "critical",
  },
  {
    type: "stripe_restricted_key",
    pattern: /rk_live_[a-zA-Z0-9]{24,}/,
    description: "Stripe restricted API key detected",
    severity: "critical",
  },
  {
    type: "google_api_key",
    pattern: /AIza[0-9A-Za-z_-]{35}/,
    description: "Google API key pattern detected",
    severity: "critical",
  },
  {
    type: "twilio_api_key",
    pattern: /SK[0-9a-f]{32}/i,
    description: "Twilio API key pattern detected",
    severity: "critical",
  },
  {
    type: "sendgrid_key",
    pattern: /SG\.[0-9A-Za-z_-]{22,}/,
    description: "SendGrid API key detected",
    severity: "critical",
  },
  {
    type: "slack_token",
    pattern: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24,26}/,
    description: "Slack API token detected",
    severity: "critical",
  },
  {
    type: "private_key_pem",
    pattern: /-----BEGIN (?:RSA |DSA |EC )?PRIVATE KEY-----/,
    description: "Private key in PEM format detected",
    severity: "critical",
  },
  {
    type: "jwt_token",
    pattern: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
    description: "JWT token pattern detected (likely production token)",
    severity: "critical",
  },

  // ===== HARDCODED CREDENTIALS (HIGH) =====
  {
    type: "hardcoded_password",
    pattern: /password\s*[:=]\s*['"][^'"]{6,}['"]/i,
    description: "Hardcoded password value detected",
    severity: "high",
  },
  {
    type: "database_url_exposed",
    pattern: /(mongodb|mysql|postgresql|postgres|redis)\s*[:=]\s*['"][^'"]+['"].*(?:password|pwd|user|username)/i,
    description: "Database connection string with credentials detected",
    severity: "high",
  },
  {
    type: "api_key_in_code",
    pattern: /(?:api[-_]?key|apikey|api[-_]?secret)\s*[:=]\s*['"][^'"]{10,}['"]/i,
    description: "API key hardcoded in configuration",
    severity: "high",
  },

  // ===== INJECTION RISKS (HIGH/MEDIUM) =====
  {
    type: "sql_injection_template",
    pattern: /\$\{.*?\}.*?(?:SELECT|INSERT|UPDATE|DELETE|DROP|FROM|WHERE)/i,
    description: "Potential SQL injection via template literal or string concatenation",
    severity: "high",
  },
  {
    type: "sql_concat",
    pattern: /SELECT.*\+|".*"\s*\+\s*".*"|query.*\+.*[a-zA-Z]/i,
    description: "SQL query built via string concatenation (not parameterized)",
    severity: "high",
  },
  {
    type: "command_injection",
    pattern: /(?:exec|spawn|system|shell_exec|passthru|shell)\s*\(\s*[`\$\+]|child_process\./i,
    description: "Command execution with potentially unsanitized input",
    severity: "high",
  },

  // ===== XSS & CODE INJECTION (MEDIUM) =====
  {
    type: "xss_dangerous_html",
    pattern: /dangerouslySetInnerHTML|innerHTML\s*=/,
    description: "Potential XSS via raw HTML injection (React dangerouslySetInnerHTML)",
    severity: "medium",
  },
  {
    type: "code_eval",
    pattern: /\beval\s*\(|new Function\s*\(|Function\s*\(/,
    description: "Use of eval() or Function() constructor - potential code injection",
    severity: "medium",
  },
  {
    type: "dynamic_require",
    pattern: /require\s*\(\s*[`\$\+]|import\s*\(\s*[`\$\+]/,
    description: "Dynamic require/import with user input - code injection risk",
    severity: "medium",
  },

  // ===== SECURITY MISCONFIGURATION (MEDIUM/HIGH) =====
  {
    type: "debug_mode_enabled",
    pattern: /debug\s*[:=]\s*(?:true|True|1)|DEBUG\s*[:=]\s*(?:true|True|1)/i,
    description: "Debug mode enabled in configuration",
    severity: "medium",
  },
  {
    type: "cors_wildcard",
    pattern: /CORS|cors|Access-Control.*?\*|wildcard|'?\*'?/i,
    description: "CORS misconfiguration detected (may allow all origins)",
    severity: "medium",
  },
  {
    type: "disabled_ssl",
    pattern: /(?:verify|SSL|TLS|HTTPS).*?(?:false|False|0|disabled|skip)/i,
    description: "SSL/TLS verification disabled",
    severity: "high",
  },

  // ===== DATA EXPOSURE (HIGH) =====
  {
    type: "pii_logging",
    pattern: /(?:email|phone|ssn|credit.*card|password|token).*(?:log|console\.log|print)/i,
    description: "PII (Personally Identifiable Information) potentially logged",
    severity: "high",
  },
  {
    type: "error_message_exposure",
    pattern: /error.*?message.*?response|expose.*?error|verbose.*?error/i,
    description: "Verbose error messages may expose internal details",
    severity: "medium",
  },

  // ===== BUSINESS LOGIC RISKS (HIGH) =====
  {
    type: "price_client_side",
    pattern: /(?:price|cost|amount|total)\s*[:=].*(?:client|frontend|javascript|react)/i,
    description: "Price/cost validation on client-side only (can be manipulated)",
    severity: "high",
  },
  {
    type: "race_condition_pattern",
    pattern: /(?:check|verify).*then.*(?:use|act|execute)|TOCTOU|race condition/i,
    description: "Potential race condition or TOCTOU vulnerability",
    severity: "high",
  },

  // ===== MISSING PROTECTIONS (MEDIUM/LOW) =====
  {
    type: "no_rate_limiting",
    pattern: /(?:rate.*limit|throttle|ratelimit).*?(?:missing|false|disabled|TODO|FIXME)/i,
    description: "Rate limiting missing or disabled on sensitive endpoints",
    severity: "medium",
  },
  {
    type: "no_input_validation",
    pattern: /(?:validate|sanitize|check).*?(?:missing|TODO|FIXME|disabled|false)/i,
    description: "Input validation appears to be missing or disabled",
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
