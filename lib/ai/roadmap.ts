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
}

export interface RoadmapGenerationInput {
  repoName: string;
  readme: string | null;
  fileTree: Array<{ name: string; type: string; path: string }> | string[];
  issues: Array<{ title: string; body: string | null; labels: string[] }>;
}

export async function generateRoadmap(
  input: RoadmapGenerationInput
): Promise<GeneratedTask[]> {
  const prompt = buildRoadmapPrompt(input);

  try {
    const message = await client.messages.create({
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
3. Generate 12-18 tasks (not fewer, not more)
4. Include only realistic, shipping-focused tasks
5. Return ONLY valid JSON, nothing else
6. Never include explanatory text before or after JSON

TASK STRUCTURE:
- title: Clear, action-oriented (verb first)
- description: 1-2 sentences, acceptance criteria
- estimate: 30 or 60 (minutes)
- difficulty: 1 (trivial) to 5 (complex)
- priority: 1-10 (higher = more important for shipping)
- files: Array of file paths likely to be touched
- microSteps: 3-5 concrete sub-steps`,
    });

    // Extract the JSON from the response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Parse the JSON response
    const tasks = JSON.parse(content.text) as GeneratedTask[];

    // Validate the response
    if (!Array.isArray(tasks)) {
      throw new Error("Response is not an array of tasks");
    }

    if (tasks.length < 10 || tasks.length > 20) {
      throw new Error(`Expected 12-18 tasks, got ${tasks.length}`);
    }

    // Ensure all tasks have required fields
    tasks.forEach((task, index) => {
      if (
        !task.title ||
        !task.description ||
        !task.estimate ||
        !task.difficulty ||
        task.priority === undefined ||
        !Array.isArray(task.files) ||
        !Array.isArray(task.microSteps)
      ) {
        throw new Error(`Task ${index} is missing required fields`);
      }
    });

    return tasks;
  } catch (error) {
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

  const fileTreeStr = fileTreeArray
    .slice(0, 30)
    .map((f) => `  - ${f}`)
    .join("\n");

  const issuesStr = input.issues
    .slice(0, 10)
    .map((issue) => `  - ${issue.title}`)
    .join("\n");

  return `Repository: ${input.repoName}

README:
${input.readme ? input.readme.slice(0, 2000) : "(No README found)"}

File Tree (top 30 files):
${fileTreeStr}

Open Issues (first 10):
${issuesStr || "(No open issues)"}

Generate a detailed shipping roadmap as a JSON array of tasks.
Each task should move the project toward completion and deployment.
Return ONLY the JSON array, nothing else.

[
  {
    "title": "...",
    "description": "...",
    "estimate": 30 or 60,
    "difficulty": 1-5,
    "priority": 1-10,
    "files": [...],
    "microSteps": [...]
  }
]`;
}

// Validate and retry logic
export async function generateRoadmapWithRetry(
  input: RoadmapGenerationInput,
  maxRetries: number = 2
): Promise<GeneratedTask[]> {
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
