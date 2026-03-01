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
}

export interface SecurityAuditReport {
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

  const prompt = `Repository: ${input.repoName}

Static scan findings:
${grepStr}

---

Source code to analyze:
${fileContents}

---

Perform a comprehensive security audit of this repository. Analyze the provided source code for vulnerabilities including:
- OWASP Top 10 vulnerabilities
- Authentication and authorization bypasses
- Injection attacks (SQL, command, code)
- Secrets and credentials in code
- Missing input validation
- Insecure dependencies
- API security issues
- Data exposure risks

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "summary": "string (2-3 sentences overview of risk level)",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "findings": [
    {
      "category": "string (e.g., 'Authentication', 'Injection Risk')",
      "description": "string (detailed explanation of the vulnerability)",
      "severity": "low" | "medium" | "high" | "critical",
      "file": "string (path to affected file, optional)",
      "line": "string (line number or range, optional)",
      "recommendation": "string (how to fix or mitigate)"
    }
  ],
  "recommendations": ["string (high-level security improvement)"]
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system:
      "You are a senior security engineer expert in OWASP vulnerabilities, secure coding practices, and threat modeling. Analyze the provided source code thoroughly for security issues. Return ONLY valid JSON. No markdown, no explanation before or after.",
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

  // Basic validation
  if (!report.summary || !report.riskLevel || !Array.isArray(report.findings)) {
    throw new Error("Invalid security audit response structure");
  }

  return report;
}
