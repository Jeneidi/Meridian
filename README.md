# Meridian — Ship Projects with Accountability

> **Stop planning. Start shipping.**

An AI-powered project shipping coach that turns your GitHub repo into a daily accountability system.

## What is Meridian?

Meridian helps builders (students, indie hackers, founders) ship portfolio projects faster by:

1. **Analyzing your repo** → Claude AI reads your GitHub repo structure, README, and issues
2. **Generating a roadmap** → Breaks down your project into 12-18 concrete 30-60 minute tasks
3. **Picking your next task** → Every day, Meridian selects your best next action using an intelligent scoring algorithm
4. **Coaching after work** → Get honest, diff-aware feedback after each work session

**Not a code writer. Not a tutor. A shipping accountability system.**

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- GitHub account (for authentication)
- Anthropic API key (for Claude AI)
- Supabase PostgreSQL database

### Local Development Setup

#### 1. Clone & Install

```bash
git clone <repo-url>
cd meridian
npm install
```

#### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

**Auth:**
- `NEXTAUTH_URL`: `http://localhost:3000` (local) or your production URL
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: Create OAuth app at https://github.com/settings/developers
- Scopes needed: `read:user user:email repo` (read-only)

**Database:**
- `DATABASE_URL`: Supabase connection string (with pooling)
- `DIRECT_URL`: Supabase direct URL (for migrations only)

**AI:**
- `ANTHROPIC_API_KEY`: Get from https://console.anthropic.com

#### 3. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 4. Start Dev Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Core Architecture

- **Frontend**: Next.js 15 (App Router), Tailwind, shadcn/ui
- **Backend**: Node.js, NextAuth v5, Prisma 6
- **Database**: Supabase PostgreSQL
- **AI**: Anthropic Claude API (Sonnet 4-6, Haiku 4.5)
- **External**: Octokit (GitHub API, read-only)

---

## Key Features

1. **Connect Repository** → Search and authenticate GitHub repos
2. **Generate Roadmap** → Claude analyzes repo, creates 12-18 tasks
3. **Daily Task Selection** → Intelligent scoring algorithm picks next best task
4. **Task Check-in** → Submit session summary, get AI coaching
5. **Progress Tracking** → Completion %, streak, task history
6. **Rate Limiting** → 3 roadmap gen/hr, 10 checkins/day
7. **Security** → Input sanitization, auth validation, security headers

---

## Deployment

### Vercel Setup

1. **Create Vercel project**: `vercel link`
2. **Set environment variables** in Vercel dashboard
3. **Run migrations**: `npx prisma migrate deploy`
4. **Deploy**: `git push` (auto-deploys on Vercel)

### Required Environment Variables

```
NEXTAUTH_URL=https://meridian.vercel.app
NEXTAUTH_SECRET=<generate with openssl rand -base64 32>
GITHUB_CLIENT_ID=<from GitHub OAuth app>
GITHUB_CLIENT_SECRET=<from GitHub OAuth app>
DATABASE_URL=<Supabase connection string>
DIRECT_URL=<Supabase direct URL>
ANTHROPIC_API_KEY=<from console.anthropic.com>
```

---

## Testing

### Manual E2E
1. Login with GitHub
2. Connect a repo
3. Generate roadmap (should take 30-60 sec)
4. See "Today's Task" on dashboard
5. Submit a check-in, get coaching
6. Mark task done, check streak updates

### Rate Limiting
- Try 4 roadmap generations in 1 hour (4th returns 429)
- Try 11 check-ins in 1 day (11th returns 429)

---

## Project Structure

```
meridian/
├── app/                     # Next.js App Router
│   ├── (marketing)/         # Public pages
│   ├── (app)/               # Authenticated app
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui primitives
│   ├── marketing/           # Landing page components
│   └── app/                 # Dashboard components
├── lib/
│   ├── auth.ts              # NextAuth setup
│   ├── db.ts                # Prisma client
│   ├── github/              # GitHub API wrapper
│   ├── ai/                  # Claude API prompts
│   ├── rate-limit.ts        # Rate limiter
│   ├── security.ts          # Input validation
│   └── progress.ts          # Streak calculation
├── prisma/
│   └── schema.prisma        # Data model
└── docs/                    # Positioning, skills checklist
```

---

## Performance

- **Build**: ~1s (Turbopack)
- **Static Routes**: Prerendered (`/`, `/pricing`, `/login`)
- **LCP Target**: <2.5s
- **Bundle**: ~250KB JS (gzipped)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ANTHROPIC_API_KEY not found` | Check `.env.local` and Vercel settings |
| `GitHub OAuth mismatch` | Verify redirect URI matches `NEXTAUTH_URL` |
| `Database connection failed` | Check Supabase connection string & pooling |
| `Rate limit 429 on roadmap gen` | Wait 1 hour or check `lib/rate-limit.ts` |

---

## License

MIT — Build freely, ship fast.

---

Made with 🚀 by builders, for builders. **Stop planning. Start shipping.**
