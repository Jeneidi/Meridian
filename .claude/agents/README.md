# Meridian — VoltAgent Subagents Directory

This directory contains 17 specialized Claude Code subagents from the [VoltAgent awesome-claude-code-subagents](https://github.com/voltagent/awesome-claude-code-subagents) repository, integrated into Meridian's development workflow.

## When & How to Use Each Agent

### Frontend & UI Design

**`ui-designer.md`**
- **When**: Design system decisions, component library choices, visual accessibility
- **Example**: "Have the ui-designer review our TaskCard component design"

**`frontend-developer.md`**
- **When**: React component architecture, Framer Motion patterns, responsive design
- **Example**: "Ask the frontend-developer to architect the RoadmapBoard component"

**`nextjs-developer.md`**
- **When**: App Router structure, RSC patterns, route handlers, middleware
- **Example**: "Have the nextjs-developer review our API route structure"

### Backend & API

**`api-designer.md`**
- **When**: REST API design, endpoint structure, GitHub API integration
- **Example**: "Have the api-designer review our /api/repos endpoints"

**`backend-developer.md`** (Node.js specialist)
- **When**: Server-side logic, middleware, performance optimization
- **Example**: "Ask the backend-developer to optimize the roadmap generation pipeline"

### Security

**`security-auditor.md`**
- **When**: Full security audit, OWASP review, auth scopes validation
- **Example**: "Have the security-auditor review our GitHub OAuth scopes and data storage"

**`security-engineer.md`**
- **When**: Infrastructure hardening, rate limiting, CSP headers, secret management
- **Example**: "Ask the security-engineer to design our rate limiting strategy"

### Database

**`database-administrator.md`**
- **When**: Prisma schema design, RLS policies, index design, migrations
- **Example**: "Have the database-administrator review our Prisma schema for performance"

### AI/LLM

**`llm-architect.md`**
- **When**: Prompt design, Claude API integration, guardrails, latency optimization
- **Example**: "Have the llm-architect design our roadmap generation prompt"

**`prompt-engineer.md`**
- **When**: Specific prompt tuning, few-shot examples, output formatting
- **Example**: "Have the prompt-engineer refine our diff coaching prompt"

### Quality & Testing

**`qa-expert.md`**
- **When**: Test strategy, test planning, coverage goals
- **Example**: "Have the qa-expert design our Playwright E2E test plan"

**`code-reviewer.md`**
- **When**: Pre-milestone code review, security + quality standards
- **Example**: "Have the code-reviewer audit our auth middleware code"

### DevOps & Deployment

**`deployment-engineer.md`**
- **When**: Vercel config, CI/CD setup, env var management
- **Example**: "Have the deployment-engineer set up our Vercel + GitHub Actions pipeline"

**`performance-engineer.md`**
- **When**: Bundle analysis, LCP optimization, Core Web Vitals
- **Example**: "Have the performance-engineer audit our landing page bundle size"

### Product & Marketing

**`content-marketer.md`**
- **When**: Landing page copy, differentiation messaging, positioning
- **Example**: "Have the content-marketer write our Hero section copy"

**`product-manager.md`**
- **When**: Feature prioritization, MoSCoW scoping, milestone planning
- **Example**: "Have the product-manager help prioritize M1-M10 milestones"

**`technical-writer.md`**
- **When**: README, API docs, env var documentation, setup guides
- **Example**: "Have the technical-writer draft our README setup section"

### Architecture Review

**`architect-reviewer.md`**
- **When**: Pre-implementation architecture review, design trade-offs
- **Example**: "Have the architect-reviewer review our API and data model design"

---

## Quick Command Examples

All agents are Claude Code subagents. To invoke them, use the standard Claude Code pattern:

```
Have the [agent-name] [task description]
```

Or for more complex tasks:

```
Ask the [agent-name] to [specific request] with the following context: [context]
```

## Agent Selection Guide by Milestone

| Milestone | Key Agents |
|---|---|
| M0 — Scaffold | nextjs-developer, ui-designer |
| M1 — Auth | security-auditor, backend-developer |
| M2 — Connect Repo | api-designer, security-engineer |
| M3 — Roadmap Gen | llm-architect, prompt-engineer |
| M4 — Dashboard UI | frontend-developer, ui-designer, performance-engineer |
| M5 — Daily Task | prompt-engineer, backend-developer |
| M6 — Check-in | llm-architect, prompt-engineer |
| M7 — Progress Metrics | frontend-developer, ui-designer |
| M8 — Landing Page | content-marketer, frontend-developer, performance-engineer |
| M9 — Rate Limiting | security-engineer, backend-developer |
| M10 — QA + Deploy | qa-expert, deployment-engineer, code-reviewer, performance-engineer |

---

## Notes

- **Agent files are read-only templates** — they contain the specialized prompts and context for each agent
- **Auto-discovery** — Claude Code automatically detects agents in `.claude/agents/`
- **Stateless** — Each invocation is fresh; agents don't maintain session state
- **Customization** — Feel free to edit these files to add project-specific context or adjust instructions
