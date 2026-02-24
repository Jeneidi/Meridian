# Meridian — Positioning & Differentiation

## Category
**Project shipping accountability platform** — not a coding chatbot, not a tutor, not an IDE.

## Problem
Builders (students, bootcamp grads, indie hackers) start ambitious projects but struggle with:
- **Scope drift**: No clear structure of what "done" looks like
- **Lost momentum**: Don't know what to work on next, why it matters
- **Procrastination**: Too many choices, easy to go down rabbit holes
- **Isolation**: No feedback loop on daily progress or code quality

Current "solutions" fall short:
- **GitHub Copilot, Cursor** → Write code faster, but don't help you know *what* to build
- **Replit** → Hosted environment, but no project guidance or roadmapping
- **Notion, Linear** → Generic todo tools, no GitHub integration or project context
- **ChatGPT** → Answers code questions, but doesn't create a shipping plan or accountability

## Solution
**Meridian** turns a GitHub repo into an automated project roadmap of 30–60 minute tasks, surfaces the best next task daily, and coaches progress via diff-aware feedback each session.

### Core Loop
1. **Connect repo** → GitHub OAuth, read README + issues + file tree
2. **Generate roadmap** → LLM breaks project into 15–20 actionable tasks with micro-steps
3. **Daily next task** → Intelligent selection based on priority, difficulty, streak
4. **Check-in coaching** → AI reviews your session diff, gives narrative feedback + 3 next actions

## Differentiation

| Feature | Meridian | ChatGPT | Copilot | Cursor | Replit | Notion |
|---|---|---|---|---|---|---|
| **Reads your repo context** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Auto-generates roadmap from repo** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Diff-aware coaching** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Daily task selection** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **No code generation** | ✅ | ❌ | ✅ | ✅ | N/A | N/A |
| **Shipping-focused** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Accountability (streak, progress)** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Key Messaging
- **Hero tagline**: "Stop planning. Start shipping."
- **Core value**: "Connect repo → auto roadmap → daily next step → coaching"
- **Anti-positioning**: "Not a chatbot. Not a tutor. A shipping coach."

## Target User Persona
**The Builder**
- Age: 18–35
- Background: CS student, bootcamp grad, or indie hacker
- Goal: Ship portfolio projects that land jobs or signal competence
- Pain: "I have an idea but don't know where to start. I build in circles."
- Success metric: "Shipped something meaningful this week, know what's next"

## Monetization
**Freemium model** (Stripe integration v2):
- **Free**: 1 connected repo, rate-limited roadmap generation, basic progress tracking
- **Pro** ($9–15/mo): Unlimited repos, daily coaching, full history, team seats (future)

## Competitive Advantages
1. **GitHub-native** — Meridian *understands* your project by reading it
2. **Momentum-focused** — Not about code quality; about shipping something today
3. **Diff-based** — Coaching adapts to what you actually built, not hypotheticals
4. **Anti-hallucination** — Never writes code. Only breaks down scope and coaches progress.
5. **Solo-friendly** — No heavy infrastructure. Works for a single builder or a small team.

## Marketing Channels
- HN / Reddit (r/learnprogramming, r/webdev)
- GitHub trending (via SEO on landing page)
- Twitter (shipping updates, builder stories)
- CS education (partnerships with bootcamps, online courses)
