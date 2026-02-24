# Meridian — Engineering Log

## Documentation
Always use `context7` when writing or reviewing code involving: Next.js, Prisma, Supabase, Framer Motion, @anthropic-ai/sdk, NextAuth, Octokit, Stripe, shadcn/ui, Tailwind CSS. This ensures all code references current API versions, not training data.

## Bug Fixes & Issues (Append-Only Log)

*No entries yet. Each resolved issue will be logged here with timestamp, symptom, root cause, fix, files changed, and verification method.*

## Key Decisions
- Brand: Meridian | Hero: "Stop planning. Start shipping."
- Auth: GitHub OAuth (NextAuth v5)
- DB: Supabase + Prisma
- LLM: Anthropic Claude (Haiku for speed, Sonnet for reasoning)
- UI: Dark-first, Framer Motion animations, shadcn/ui + Tailwind
- Analytics: PostHog
- MCP: Context7 (always active), 21st.dev Magic (conditional, if free beta)

## MCP Configuration
- `.mcp.json` in root with Context7 stdio transport
- 21st.dev Magic MCP can be added if still free during beta
- All library docs fetched at query time via Context7

## Development Notes
- Read-only GitHub scopes: "read:user user:email repo"
- No full repo code stored in DB
- Stripe SDK installed but paywall logic in v2
- Rate limiting: 3 roadmap gens/hr, 10 checkins/day per user
