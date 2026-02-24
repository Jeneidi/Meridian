# Anthropic Skills → Meridian Implementation Checklist

Source: https://github.com/anthropics/skills

## Document Skills (pdf, docx, pptx, xlsx)
Not directly used in Meridian v1.

## Creative & Design Skills

### ✅ frontend-design
- **Used in**: M8 — Landing page + app UI system
- **Task**: Create bold, distinctive landing page aesthetic (not generic AI look)
- **Approach**: Dark-first design, glass cards, Framer Motion animations
- **Files**: components/marketing/Hero.tsx, landing page sections

### ✅ theme-factory
- **Used in**: Design system setup (M0, M4)
- **Task**: Apply consistent color palette + typography across UI
- **Color palette**: Space navy (#0A0E1A), electric indigo (#6366F1), momentum green (#10B981)
- **Typography**: Inter (UI), Geist Mono (code)
- **Files**: tailwind.config.ts, globals.css

### ⭕ algorithmic-art, canvas-design, slack-gif-creator
- **Not used in v1** — no generative art or GIF workflows

## Development & Technical Skills

### ✅ web-artifacts-builder
- **Used in**: M0 — Component library setup
- **Task**: Set up React 18 + TypeScript + Tailwind + shadcn/ui
- **Approach**: Use shadcn/ui for Button, Card, Input, Form, Dialog, Popover
- **Files**: components/ui/*, shadcn/ui config

### ✅ webapp-testing
- **Used in**: M10 — QA & E2E tests
- **Task**: Playwright tests for auth flow, roadmap generation, check-in submission
- **Scope**: Auth → Dashboard → Connect repo → Generate roadmap → Mark task done → Check-in
- **Files**: tests/e2e/*.spec.ts

### ⭕ mcp-builder
- **Not used in v1** — Context7 + 21st.dev Magic MCPs already available
- **Future (v2)**: Build custom MCP server for GitHub repo-to-roadmap pipeline

## Enterprise & Communication Skills

### ✅ brand-guidelines
- **Used in**: Marketing site + app UI
- **Task**: Apply Anthropic's brand aesthetic if differentiating Meridian brand
- **Decision**: Use Meridian's own dark-first palette instead of Anthropic colors
- **Impact**: Low priority for v1

### ✅ doc-coauthoring
- **Used in**: M0 — Creating this skills checklist + positioning doc
- **Task**: Follow structured doc creation workflow (context → refinement → review)
- **Files**: docs/skills-checklist.md, docs/positioning.md, README.md

### ⭕ internal-comms
- **Not used** — No company internal comms needed (solo product)

## Key Milestones Using Skills

| Milestone | Skills Used |
|---|---|
| M0 — Scaffold | web-artifacts-builder, theme-factory |
| M4 — Dashboard UI | frontend-design, web-artifacts-builder, theme-factory |
| M8 — Landing page | frontend-design, theme-factory |
| M10 — QA | webapp-testing |

## Summary
- **16 Anthropic skills available**
- **5 skills directly used** in Meridian v1: frontend-design, theme-factory, web-artifacts-builder, webapp-testing, doc-coauthoring
- **Other skills**: Not applicable to core roadmapping + coaching product, but available for reference or future expansion

## Notes
- Skills serve as reference implementations + best practices
- Meridian integrates **VoltAgent subagents** (17 agents) more heavily for specialized workflows (security, architecture, LLM prompt design, content marketing, etc.)
- Skills are Anthropic's official "knowledge packs"; subagents are community-maintained Claude Code specialists
