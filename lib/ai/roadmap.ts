import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface GeneratedTask {
  title: string;
  description: string;
  estimate: 30 | 60; // minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  priority: number; // 1-10
  files: string[];
  microSteps: string[];
  isOptional: boolean; // true = enhancement/optimization, false = core/bug fix
  category: "feature" | "bug" | "improvement"; // task type
}

export interface RoadmapMetadata {
  projectType: string; // "library" | "fullstack-app" | "cli-tool" | "component-library" | "api" | "other"
  complexity: "simple" | "moderate" | "complex";
  documentationNeeds: {
    needsFullReadme: boolean;
    needsComprehensiveSetupGuide: boolean;
    needsReproductionSteps: boolean;
    needsExtensiveVerification: boolean;
    reasoning: string;
  };
}

export interface RoadmapGenerationInput {
  repoName: string;
  readme: string | null;
  fileTree: Array<{ name: string; type: string; path: string }> | string[];
  issues: Array<{ title: string; body: string | null; labels: string[] }>;
  packageJson: string | null; // package.json content for dependency analysis
}

export async function generateRoadmap(
  input: RoadmapGenerationInput
): Promise<{ tasks: GeneratedTask[]; metadata: RoadmapMetadata; message?: string }> {
  const prompt = buildRoadmapPrompt(input);

  try {
    console.log("🚀 Roadmap generation started for:", input.repoName);

    const apiResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system: `You are Meridian, a shipping coach for developers. Your job is to break down GitHub repositories into a series of concrete, actionable 30-60 minute tasks.

RULES:
1. Never write code - only define tasks and guidance
2. Each task should be completable in 30-60 minutes
3. TASK COUNT: Generate ANY number of tasks from 0-20 based on WHAT THE PROJECT ACTUALLY NEEDS, not a fixed number:
   - 0 tasks: Project is well-maintained, complete, no obvious gaps
   - 1-5 tasks: Mature projects with minor improvements needed (polish, docs, one missing feature)
   - 6-12 tasks: Active projects with clear roadmap (new features, testing, refactoring)
   - 13-20 tasks: Early-stage projects with significant work (core features, architecture, infrastructure)
4. ONLY suggest tasks for things that are GENUINELY MISSING OR BROKEN — never fabricate problems or suggest tasks for features that already exist
5. CROSS-CHECK FILE TREE before suggesting: if requirements.txt exists, don't suggest adding it; if /tests or /spec exists, don't suggest "add tests"; if CHANGELOG exists, don't suggest "create changelog"
6. USE PROJECT CONTEXT TO DETERMINE TASK TYPE:
   - Web apps/frontends: UI components, API integration, responsive design, error handling, accessibility, performance, analytics
   - Backend APIs/servers: endpoint implementation, authentication, rate limiting, caching, error handling, API documentation
   - Libraries/packages: API design, documentation, examples, test coverage, performance optimization, type definitions
   - ML/data projects: data preprocessing, feature engineering, model evaluation, reproducibility (requirements.txt), experiment tracking, visualization
   - CLI tools: command parsing, help text, error messages, configuration files, shell completion
   - Mobile apps: platform-specific features, navigation, offline support, state management
   - DevOps/infrastructure: automation, monitoring, logging, security hardening, disaster recovery
7. REASONING: For each task (or lack of tasks), explain your thinking based on: project maturity, what exists vs what's missing, user expectations for this project type

8. OPTIONAL vs REQUIRED tasks:
   - REQUIRED (isOptional: false): bugs, broken features, missing core functionality that blocks users
   - OPTIONAL (isOptional: true): auth, payment integration, analytics, CI/CD, SEO, performance — valuable but not blocking
   - If a web app clearly has no auth: suggest "Add authentication" as OPTIONAL (not required)
   - If a repo has payment-like features in README but no payment library in package.json: suggest as OPTIONAL

9. DEPLOYMENT CONTEXT — if the project is a web app/SaaS/API that will go online:
   - Check for missing: auth system, session handling, payment integration, rate limiting, CORS, environment config
   - Suggest each as OPTIONAL tasks (they're important but not core)
   - Examples: no 'next-auth' / 'passport' / 'auth0' → suggest auth; no 'stripe' / 'paddle' → suggest payments
   - DO NOT suggest these for CLI tools, libraries, local scripts, or data science repos

10. BUG DETECTION — surface from multiple signals:
    - GitHub issues with "bug" label → create tasks with category: "bug"
    - README mentions "known issue", "TODO", "FIXME", "broken", "not working" → flag as bug tasks
    - package.json has conflicting/outdated major dependencies → flag as improvement task
    - NEVER fabricate bugs — only report what evidence supports

11. MISSING FEATURE DETECTION from package.json:
    - Has 'express'/'fastify' but no 'helmet' → missing security headers (suggest as optional)
    - Has React/Next but no 'react-query'/'swr' → may need data fetching strategy
    - Has database ORM but no migration tooling → suggest migrations setup
    - Has auth but no 'rate-limiter' → suggest rate limiting (optional)
    - Base suggestions on what's actually in package.json, not assumptions

TASK STRUCTURE:
- title: Clear, action-oriented (verb first)
- description: 1-2 sentences, acceptance criteria
- estimate: 30 or 60 (minutes)
- difficulty: 1 (trivial) to 5 (complex)
- priority: 1-10 (higher = more important for shipping)
- files: Array of file paths likely to be touched
- microSteps: 3-5 concrete sub-steps
- isOptional: true if task is an enhancement/optimization, false if it fixes something broken or missing core functionality
- category: "bug" for known issues/fixes, "feature" for new additions, "improvement" for optimizations/enhancements

PROJECT ANALYSIS STRUCTURE (return as metadata object):
- projectType: Classify as "library" | "fullstack-app" | "cli-tool" | "component-library" | "api" | "other"
- complexity: Rate as "simple" | "moderate" | "complex"
- documentationNeeds: Object with booleans for each documentation type:
  - needsFullReadme: true if project requires comprehensive README
  - needsComprehensiveSetupGuide: true if setup is complex (multiple steps, dependencies, etc)
  - needsReproductionSteps: true if project requires reproducible examples or test cases
  - needsExtensiveVerification: true if project needs thorough QA/verification
  - reasoning: Explain why each is needed or not needed

OPTIONAL MESSAGE:
- If tasks array is empty (0 tasks), include a "message" field explaining why the project looks good (e.g., "Looks great! This project is well-maintained with no critical gaps.")
- Only include message when tasks is empty, not when tasks exist`,
    });

    console.log("📡 Claude API response received");
    console.log("   Usage: input_tokens=", apiResponse.usage.input_tokens, ", output_tokens=", apiResponse.usage.output_tokens);

    // Extract the JSON from the response
    const content = apiResponse.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    console.log("📝 Raw response (first 500 chars):", content.text.substring(0, 500));

    // Parse the JSON response
    let responseData: { tasks: GeneratedTask[]; metadata: RoadmapMetadata; message?: string };
    let jsonText = content.text.trim();

    // Try to extract JSON from markdown code blocks if wrapped
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      console.log("📦 JSON found in markdown code block, extracting...");
      jsonText = jsonMatch[1].trim();
    }

    try {
      responseData = JSON.parse(jsonText) as { tasks: GeneratedTask[]; metadata: RoadmapMetadata; message?: string };
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      console.error("   Text being parsed:", jsonText.substring(0, 200));
      console.error("   Full response:", content.text.substring(0, 1000));
      throw new Error(
        `Failed to parse roadmap from Claude: Invalid JSON response. Error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
      );
    }

    const { tasks, metadata, message } = responseData;

    console.log("✅ JSON parsed successfully, task count:", tasks.length);
    if (message) {
      console.log("💬 Message from Claude:", message);
    }
    console.log("📊 Project analysis:", {
      projectType: metadata.projectType,
      complexity: metadata.complexity,
      documentation: metadata.documentationNeeds.reasoning,
    });

    // Validate the response
    if (!Array.isArray(tasks)) {
      throw new Error("Response is not an array of tasks");
    }

    if (tasks.length > 20) {
      throw new Error(`Too many tasks generated: ${tasks.length}. Max is 20.`);
    }

    // Ensure all tasks have required fields (only if tasks exist)
    if (tasks.length > 0) {
      tasks.forEach((task, index) => {
        if (
          !task.title ||
          !task.description ||
          !task.estimate ||
          !task.difficulty ||
          task.priority === undefined ||
          !Array.isArray(task.files) ||
          !Array.isArray(task.microSteps) ||
          task.isOptional === undefined ||
          !task.category
        ) {
          throw new Error(`Task ${index} is missing required fields (title, description, estimate, difficulty, priority, files, microSteps, isOptional, category)`);
        }
      });
    }

    console.log("✅ All tasks validated successfully");
    return { tasks, metadata, message };
  } catch (error) {
    console.error("❌ Roadmap generation error:", error);
    if (error instanceof SyntaxError) {
      throw new Error(
        "Failed to parse roadmap from Claude: Invalid JSON response"
      );
    }
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error: ${error.message}`);
    }
    throw error;
  }
}

function buildRoadmapPrompt(input: RoadmapGenerationInput): string {
  const fileTreeArray = Array.isArray(input.fileTree)
    ? input.fileTree.map((f) =>
        typeof f === "string" ? f : `${f.path} (${f.type})`
      )
    : [];

  // Optimized for cost: reduce context to essential information
  const fileTreeStr = fileTreeArray
    .slice(0, 15) // Reduced from 30 to 15 (still shows structure)
    .map((f) => `  - ${f}`)
    .join("\n");

  const issuesStr = input.issues
    .slice(0, 5) // Reduced from 10 to 5 (most critical issues)
    .map((issue) => `  - ${issue.title}${issue.body ? ` — ${issue.body.slice(0, 100)}` : ""}`)
    .join("\n");

  return `Repository: ${input.repoName}

README:
${input.readme ? input.readme.slice(0, 1200) : "(No README found)"}

File Tree (top 15 files):
${fileTreeStr}

Dependencies (package.json):
${input.packageJson ? input.packageJson.slice(0, 1000) : "(No package.json — not a Node.js project)"}

Open Issues (first 5):
${issuesStr || "(No open issues)"}

Analyze this project and generate a detailed shipping roadmap.

FIRST: Analyze the project type, complexity, and what documentation is actually needed based on:
- Is it a library, app, tool, or component?
- How complex is the setup/implementation?
- Do developers need a full README, or is the code self-explanatory?
- Are comprehensive setup guides necessary, or just quick steps?
- Does it need test cases/reproduction steps to verify?
- Does it require extensive QA, or can basic testing suffice?

THEN: Based on the project type, maturity, and what's already present, generate 0-20 tasks (the EXACT number that makes sense for THIS project):
- Reason about project state: Is this an MVP needing core features? A mature project needing polish? An abandoned project needing revival?
- Check what already exists: Use the file tree, README, and issues to avoid duplicate suggestions
- Prioritize by shipping value: What will most impact users/developers? Start with that
- Match suggestion to project type: A data pipeline doesn't need "improve UI", a web app doesn't need "optimize ML model"
- If nothing is genuinely missing or broken, return 0 tasks with an explanation of why the project looks good

Return ONLY a JSON object with this structure (nothing else):
{
  "tasks": [
    {
      "title": "...",
      "description": "...",
      "estimate": 30 or 60,
      "difficulty": 1-5,
      "priority": 1-10,
      "files": [...],
      "microSteps": [...],
      "isOptional": false,
      "category": "feature"
    }
  ],
  "message": "Only include when tasks is empty (0 tasks). Explain why the project looks good.",
  "metadata": {
    "projectType": "library|fullstack-app|cli-tool|component-library|api|other",
    "complexity": "simple|moderate|complex",
    "documentationNeeds": {
      "needsFullReadme": boolean,
      "needsComprehensiveSetupGuide": boolean,
      "needsReproductionSteps": boolean,
      "needsExtensiveVerification": boolean,
      "reasoning": "explanation of why each documentation type is or isn't needed"
    }
  }
}`;
}

// Validate and retry logic
export async function generateRoadmapWithRetry(
  input: RoadmapGenerationInput,
  maxRetries: number = 2
): Promise<{ tasks: GeneratedTask[]; metadata: RoadmapMetadata; message?: string }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await generateRoadmap(input);
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `Roadmap generation attempt ${attempt + 1} failed: ${lastError.message}`
      );

      if (attempt < maxRetries - 1) {
        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError || new Error("Roadmap generation failed");
}
