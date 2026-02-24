import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface CoachingInput {
  taskTitle: string;
  taskDescription: string;
  userSummary: string; // What the user did in the session
  diffSnippet?: string; // Recent git diff (optional, trimmed to 2000 chars)
  estimate: number; // Task estimate in minutes
  difficulty: number; // 1-5 difficulty level
}

/**
 * Generate AI coaching response after a work session
 * Focus on momentum, scope clarity, and next steps (not code review)
 */
export async function generateCoaching(input: CoachingInput): Promise<string> {
  const prompt = buildCoachingPrompt(input);

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system: `You are Meridian coaching mode. After a work session, you give brief, honest feedback on shipping progress.

Your role:
- Acknowledge what was accomplished
- Highlight shipping momentum (code written, features added, bugs fixed)
- Clarify next steps to keep momentum
- Never write code. Never rewrite their code.
- Keep it motivational but realistic (2-3 short paragraphs)

Format:
1. Acknowledgment of progress (1 sentence)
2. Momentum assessment (1-2 sentences)
3. Clear next action (1-2 sentences)`,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return content.text;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error: ${error.message}`);
    }
    throw error;
  }
}

function buildCoachingPrompt(input: CoachingInput): string {
  const diffSection = input.diffSnippet
    ? `Recent changes (git diff):
\`\`\`
${input.diffSnippet}
\`\`\`

`
    : "";

  return `Task: "${input.taskTitle}"
Description: ${input.taskDescription}
Estimate: ${input.estimate} minutes
Difficulty: ${input.difficulty}/5

Session summary from the builder:
${input.userSummary}

${diffSection}
Give brief, honest coaching feedback on this session. Did they make progress toward shipping? What's the clear next step?`;
}

/**
 * Generate coaching with retry and fallback
 */
export async function generateCoachingWithRetry(
  input: CoachingInput,
  maxRetries: number = 2
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await generateCoaching(input);
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `Coaching generation attempt ${attempt + 1} failed: ${lastError.message}`
      );

      if (attempt < maxRetries - 1) {
        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError || new Error("Coaching generation failed");
}
