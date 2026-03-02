/**
 * Deep security audit using Claude Sonnet
 * Reads actual file contents and performs comprehensive code analysis
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ScanIssue } from "@/lib/security-scan";

const client = new Anthropic();

export interface SecurityAuditInput {
  repoName: string;
  files: Array<{ path: string; content: string }>;
  grepFindings: ScanIssue[];
  readme: string | null;
  packageJson: string | null;
}

export interface SecurityAuditReport {
  projectType: string; // "saas-selling" | "web-app-free" | "public-api" | "library-package" | "cli-tool" | "academic-research" | "static-website" | "devops-infra" | "other"
  projectContext: string; // Description of what the project is
  categoriesAudited: string[]; // List of security categories that were checked
  categoriesSkipped: Array<{ name: string; reason: string }>; // Categories intentionally skipped and why
  summary: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  findings: Array<{
    category: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    file?: string;
    line?: string;
    recommendation: string;
  }>;
  recommendations: string[];
}

export async function generateSecurityAudit(
  input: SecurityAuditInput
): Promise<SecurityAuditReport> {
  // Build file contents section with path headers
  const fileContents = input.files
    .map((f) => `\n--- ${f.path} ---\n${f.content}`)
    .join("\n");

  // Format grep findings
  const grepStr =
    input.grepFindings.length > 0
      ? input.grepFindings
          .map(
            (f) =>
              `[${f.severity.toUpperCase()}] ${f.type}: ${f.description}${
                f.file ? ` in ${f.file}` : ""
              }`
          )
          .join("\n")
      : "No issues found by static scan";

  // Format project context
  const projectContext = `
Repository: ${input.repoName}

README (first 1000 chars):
${input.readme ? input.readme.slice(0, 1000) : "(No README)"}

Package.json (first 800 chars):
${input.packageJson ? input.packageJson.slice(0, 800) : "(No package.json — not a Node.js project)"}

Static scan findings:
${grepStr}

Source code (up to 50 files):
${fileContents}
`;

  const prompt = `${projectContext}

---

PHASE 1: Project Classification
Before auditing, determine what this project is:
- Is it a SaaS/product with payment processing? (e.g., Stripe, subscriptions)
- Is it a free web app with user auth but no payments?
- Is it a public API (no UI)?
- Is it a library/package for developers?
- Is it a CLI tool?
- Is it academic/research code?
- Is it a static website?
- Is it DevOps/infrastructure code?

Based on your analysis, determine which of the 22 security categories below are RELEVANT to this project type. Intentionally SKIP categories that don't apply.

SECURITY CATEGORIES (audit only applicable ones):

ALWAYS CHECK (universal):
3. INJECTION ATTACKS (SQL, NoSQL, Command, Code)
7. SENSITIVE DATA EXPOSURE
11. INSECURE DEPENDENCIES
16. INFORMATION DISCLOSURE

ONLY FOR WEB/API PROJECTS:
1. AUTHENTICATION & SESSION MANAGEMENT
2. AUTHORIZATION & ACCESS CONTROL
5. CROSS-SITE REQUEST FORGERY (CSRF)
6. SECURITY MISCONFIGURATION
8. API SECURITY ISSUES
12. DATABASE SECURITY
13. INPUT VALIDATION & OUTPUT ENCODING
14. RACE CONDITIONS & CONCURRENCY ISSUES
15. DENIAL OF SERVICE (DoS) VULNERABILITIES
18. SERVER-SIDE REQUEST FORGERY (SSRF)
20. LOGGING, MONITORING & INCIDENT RESPONSE
21. INFRASTRUCTURE & DEPLOYMENT SECURITY

ONLY FOR UI/BROWSER-FACING PROJECTS:
4. CROSS-SITE SCRIPTING (XSS)

ONLY FOR PAYMENT/SAAS PROJECTS:
9. BUSINESS LOGIC VULNERABILITIES & FINANCIAL RISKS
19. COMPLIANCE & DATA PROTECTION

ONLY FOR LIBRARIES/PACKAGES:
22. THIRD-PARTY INTEGRATIONS (for libraries exposing external APIs)

ONLY FOR DEPLOYMENT/INFRASTRUCTURE:
21. INFRASTRUCTURE & DEPLOYMENT SECURITY (already listed above)

COMPLETE CATEGORY LIST (reference only):

1. AUTHENTICATION & SESSION MANAGEMENT
   - Weak password policies or missing password validation
   - Missing MFA/2FA or optional enforcement
   - Insecure session tokens (short TTL, no HTTPOnly/Secure flags)
   - Session fixation or hijacking vulnerabilities
   - Lack of logout/session invalidation
   - Default credentials or hardcoded passwords
   - JWT signature validation missing or weak
   - Auth token storage in localStorage (XSS-vulnerable)

2. AUTHORIZATION & ACCESS CONTROL (BROKEN OBJECT LEVEL AUTHORIZATION)
   - Missing authorization checks before operations
   - User ID/resource ID from client input without verification
   - Privilege escalation paths (user→admin)
   - Insufficient role-based access control (RBAC) enforcement
   - Missing ownership validation before data access
   - Horizontal access control failures (accessing other users' data)
   - Vertical access control failures (accessing admin features as user)
   - No rate limiting per user or resource

3. INJECTION ATTACKS (SQL, NoSQL, Command, Code)
   - SQL queries built with string concatenation
   - Template literals in SQL without parameterization
   - NoSQL queries with user input in operators
   - Command execution with unsanitized user input
   - OS command injection risks (spawn, exec)
   - LDAP injection in authentication
   - XPath injection in XML processing
   - Code/eval injection (eval, Function constructor, etc.)
   - Dynamic require/import with user input

4. CROSS-SITE SCRIPTING (XSS)
   - dangerouslySetInnerHTML usage without sanitization
   - innerHTML assignment from user input
   - Unsafe string interpolation in HTML context
   - Missing Content Security Policy (CSP)
   - Stored XSS from database content rendered unsafely
   - Reflected XSS in query parameters or URL fragments
   - DOM-based XSS via document.location, window.name

5. CROSS-SITE REQUEST FORGERY (CSRF)
   - Missing CSRF tokens on state-changing operations (POST, PUT, DELETE)
   - Token validation not enforced
   - Same-site cookie attribute missing or set to 'None' without HTTPS
   - GET requests modifying state (idempotency violations)
   - No referer/origin header validation

6. SECURITY MISCONFIGURATION
   - Debug mode enabled in production
   - Verbose error messages exposing internal details
   - Default credentials not changed
   - Unnecessary services/endpoints exposed
   - Missing security headers (CSP, X-Frame-Options, X-Content-Type-Options, HSTS)
   - CORS misconfiguration (wildcard * allowing any origin)
   - Missing rate limiting on public endpoints
   - Unencrypted connections (HTTP instead of HTTPS)
   - TLS/SSL misconfiguration or outdated versions

7. SENSITIVE DATA EXPOSURE
   - Passwords/API keys logged or in error messages
   - Sensitive data in query parameters (URL)
   - Unencrypted data transmission
   - Sensitive data cached (browser, CDN, server)
   - PII (email, phone, SSN, etc.) not encrypted at rest
   - Database backups unencrypted or accessible
   - Secrets in environment variables hardcoded in code
   - Sensitive data in analytics/logging systems
   - Unmasked data in API responses (return entire user objects)
   - Missing data classification/sensitivity tagging

8. API SECURITY ISSUES
   - Unauthenticated API endpoints
   - Missing API versioning (breaking changes)
   - API keys in URLs instead of headers
   - Missing request/response validation
   - Excessive data returned in API responses (over-exposure)
   - No API rate limiting or quota enforcement
   - Deprecated endpoints not removed
   - Missing API documentation on authentication
   - No timestamp validation on requests (replay attacks)
   - Missing Content-Type validation

9. BUSINESS LOGIC VULNERABILITIES & FINANCIAL RISKS
   - Price manipulation (client-side price validation)
   - Discount/coupon stacking or reuse
   - Refund/chargeback abuse paths
   - Race conditions in payment processing
   - Inventory not decremented before payment confirmation
   - Double-spending or double-charge scenarios
   - Order modification after payment without re-validation
   - Missing transaction atomicity (partial updates possible)
   - Privilege escalation in subscription/plan upgrades
   - Account takeover enabling financial fraud
   - Insufficient audit trail for financial transactions
   - Missing reconciliation between orders and payments
   - Workflow gaps allowing unauthorized state transitions

10. CRYPTOGRAPHY & KEY MANAGEMENT
    - Weak hashing (MD5, SHA1 for passwords)
    - Passwords not hashed with salt
    - Symmetric encryption without proper key derivation
    - Hard-coded encryption keys
    - Weak/default cryptographic algorithms
    - Missing key rotation mechanisms
    - Insufficient entropy in random generation
    - Unencrypted sensitive data at rest
    - No forward secrecy in key exchange

11. INSECURE DEPENDENCIES
    - Outdated packages with known vulnerabilities
    - Unmaintained dependencies
    - Dependencies from untrusted sources
    - Supply chain attack vectors (compromised packages)
    - Missing dependency lock files (package-lock.json, pnpm-lock.yaml)
    - No vulnerability scanning/auditing setup

12. DATABASE SECURITY
    - SQL injection vulnerabilities (see #3)
    - Missing database encryption (TDE)
    - Weak database credentials
    - Overpermissioned database accounts
    - Backup files exposed/accessible
    - No access control on sensitive tables
    - Missing audit logging for data access
    - Default database ports exposed
    - Unencrypted database connections (no TLS)

13. INPUT VALIDATION & OUTPUT ENCODING
    - Missing or insufficient input validation
    - Blacklist-based validation (should be whitelist)
    - No type checking on expected inputs
    - Unbounded input sizes (DoS risk)
    - Missing validation on file uploads (type, size, content)
    - Output not properly encoded for context (HTML, JavaScript, URL)
    - Unicode/encoding bypass attacks
    - Path traversal via unsanitized file paths

14. RACE CONDITIONS & CONCURRENCY ISSUES
    - Check-then-act patterns without locking
    - TOCTOU (Time-Of-Check-Time-Of-Use) vulnerabilities
    - Concurrent API calls allowing duplicate processing
    - Missing transaction isolation levels
    - Race condition in state machine transitions
    - Async code without proper synchronization

15. DENIAL OF SERVICE (DoS) VULNERABILITIES
    - No rate limiting on endpoints
    - Unbounded loops or recursive operations
    - Large file upload acceptance
    - Expensive database queries exploitable
    - Missing request size limits
    - Resource exhaustion (memory, CPU, connections)
    - Algorithmic DoS (ReDoS in regex patterns)

16. INFORMATION DISCLOSURE
    - Stack traces/error details exposed to users
    - Debugging information in production
    - Verbose logging of sensitive data
    - Source map files exposed
    - .env or config files accidentally exposed
    - Git metadata (.git folder) exposed
    - Timing attacks revealing valid vs invalid data
    - HTTP methods not restricted (PUT, DELETE, OPTIONS)

17. FILE UPLOAD SECURITY
    - No file type validation
    - Uploaded files executable or script-able
    - Directory traversal via filename
    - No file size limits
    - Uploaded files served with wrong MIME type
    - No virus/malware scanning
    - Files stored in web-accessible directory

18. SERVER-SIDE REQUEST FORGERY (SSRF)
    - User-controlled URLs in fetch/axios calls
    - Missing URL validation for internal access
    - No allowlist for outbound requests
    - Localhost/127.0.0.1 not blocked
    - Cloud metadata endpoints accessible (169.254.169.254)

19. COMPLIANCE & DATA PROTECTION
    - Missing GDPR compliance (right to be forgotten, data export)
    - No data retention policies
    - Missing privacy policy or outdated
    - CCPA/California privacy violations
    - PCI DSS non-compliance (handling payment data)
    - SOC 2 audit readiness gaps
    - HIPAA violations if handling health data
    - Export control violations

20. LOGGING, MONITORING & INCIDENT RESPONSE
    - Insufficient audit logging
    - Log injection vulnerabilities
    - Logs not protected from tampering
    - No monitoring of security events
    - Missing alerts for suspicious activity
    - Logs not retained long enough
    - PII logged without masking
    - No incident response plan

21. INFRASTRUCTURE & DEPLOYMENT SECURITY
    - Secrets in code repositories
    - Insecure CI/CD pipeline
    - Missing environment isolation (dev/staging/prod)
    - Unauthorized code review bypasses
    - No signed commits or releases
    - Container images not scanned for vulnerabilities
    - Missing network segmentation
    - No VPC or security group restrictions

22. THIRD-PARTY INTEGRATIONS
    - OAuth flows implemented incorrectly
    - Missing state parameter in OAuth
    - Tokens leaked in redirects
    - Webhook endpoints unauthenticated
    - Webhook signature validation missing
    - Third-party API keys exposed
    - Missing validation of third-party responses

---

PHASE 2: Contextual Audit
Now audit ONLY the categories you determined are relevant in Phase 1. For irrelevant categories, skip them entirely and note them in categoriesSkipped.

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "projectType": "string (saas-selling|web-app-free|public-api|library-package|cli-tool|academic-research|static-website|devops-infra|other)",
  "projectContext": "string (1-2 sentence description of what this project is and does)",
  "categoriesAudited": ["category1", "category2", ...],
  "categoriesSkipped": [
    {"name": "Business Logic & Financial", "reason": "No payment processing detected"}
  ],
  "summary": "string (2-3 sentences overview of overall risk level and main findings)",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "findings": [
    {
      "category": "string (e.g., 'Authentication', 'SQL Injection', 'Business Logic Flaw')",
      "description": "string (specific vulnerability description with evidence from code)",
      "severity": "low" | "medium" | "high" | "critical",
      "file": "string (path to affected file, optional)",
      "line": "string (line number or range, optional)",
      "recommendation": "string (specific remediation steps)"
    }
  ],
  "recommendations": ["string (high-level security improvement action items)"]
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: `You are a context-aware security auditor expert at tailoring audits to project type. Your goal is to:

1. CLASSIFY the project based on its code, README, and dependencies
2. DETERMINE which of the 22 security categories actually apply
3. AUDIT ONLY the relevant categories to avoid false positives and wasted analysis
4. REPORT findings with full transparency on what was and wasn't checked

CRITICAL RULES:
1. Do NOT audit categories that don't apply to the project type
2. ALWAYS provide categoriesAudited and categoriesSkipped for transparency
3. For each finding, be specific with line numbers, file paths, and evidence
4. Assume the most dangerous interpretation of ambiguous code
5. Look for business logic flaws that could result in financial loss (for SaaS only)
6. Assume attacker sophistication (race conditions, timing attacks, TOCTOU)
7. Prioritize findings by business impact (money loss > data breach > availability)
8. Return ONLY valid JSON. No markdown, no commentary, no explanations
9. If you find NO issues in an audited category, don't list it — focus on what's wrong
10. Be thorough: shallow audits are worse than no audits

SEVERITY GUIDELINES:
- CRITICAL: Immediate financial loss, data breach, auth bypass, RCE, key leak
- HIGH: Significant security weakness, major privacy violation, privilege escalation
- MEDIUM: Important flaw needing prompt fix, data exposure risk, DoS capability
- LOW: Defense-in-depth gap, logging issue, or hardened-but-possible attack`,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  // Extract JSON if wrapped in markdown code blocks
  let jsonText = content.text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1].trim();
  }

  const report = JSON.parse(jsonText) as SecurityAuditReport;

  // Validate required fields
  if (
    !report.projectType ||
    !report.projectContext ||
    !Array.isArray(report.categoriesAudited) ||
    !Array.isArray(report.categoriesSkipped) ||
    !report.summary ||
    !report.riskLevel ||
    !Array.isArray(report.findings)
  ) {
    throw new Error(
      "Invalid security audit response structure — missing required fields (projectType, projectContext, categoriesAudited, categoriesSkipped, summary, riskLevel, findings)"
    );
  }

  return report;
}
