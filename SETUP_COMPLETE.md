# 🚀 Claude Code Protocol v1.0 Setup Complete

**Date**: February 27, 2026
**Status**: Active & Ready
**Next Step**: Start using this system for all Meridian work

---

## What Was Just Set Up

You now have a **complete system** for how Claude Code will work with you on Meridian. This is NOT just documentation—it's a **protocol** that locks in how we approach every task.

### 3 Core Documents Created

1. **ALGORITHMS.md** ← Read this first
   - **Planning Algorithm**: How to decide WHAT to work on
   - **Execution Algorithm**: How to actually DO it (tool order)
   - **Memory Locking**: When to record things
   - **Decision Trees**: Should I use Playwright? Tavily? Context7?

2. **CLAUDE.md** ← Already exists (engineering log)
   - Known bugs & solutions
   - Architecture decisions
   - Lessons learned
   - Performance metrics

3. **MEMORY.md** ← This is your project brain
   - Persistent state across sessions
   - Patterns discovered
   - Blocking issues
   - Implementation status

---

## How to Use This System

### Every Task Follows This Flow

```
1. START TASK
   └─ User says "Build X" or "Fix Y"

2. CHECK MEMORY (ALWAYS FIRST)
   └─ Read MEMORY.md
      - What patterns exist?
      - What blockers are known?
      - Has this been done before?

3. PLAN (using ALGORITHMS.md)
   └─ Decide approach:
      - Is this a bug fix? → use BUG_FIX_PLAN
      - Is this a feature? → use FEATURE_PLAN
      - Is this research? → use RESEARCH_PLAN
      - Lock plan into MEMORY.md BEFORE starting

4. EXECUTE (using ALGORITHMS.md execution algorithm)
   └─ Tool order:
      1. READ files (understand)
      2. GREP to find patterns
      3. EDIT files (make changes)
      4. TEST (Playwright if UI, Bash if API)
      5. UPDATE MEMORY (immediately!)

5. FINISH
   └─ Update MEMORY.md with:
      - What was done
      - Why it was done
      - Files changed
      - Lessons learned
```

---

## The 4 Critical Rules

### ✅ Rule 1: Memory is Sacred
Every time you complete something, update MEMORY.md:
```markdown
## [FEATURE]: Task Skip Feedback Loop [Status: COMPLETE]
**What**: Users can now skip tasks and get a new daily task
**Why**: Gives agency when a task doesn't fit the day
**Files**: app/api/tasks/[id]/skip/route.ts, components/SkipTaskButton.tsx
**Changes**: Added SKIP button → triggers API → deletes DailyTask record
**Lessons**: Task status filtering was broken (matched SKIPPED with "not DONE")
```

### ✅ Rule 2: Always Read Before Editing
- Use Read tool to understand file first
- Don't guess. Trace dependencies.
- Check for patterns in similar code

### ✅ Rule 3: Tool Order Matters
```
MEMORY (read)
  ↓
GREP (search)
  ↓
READ (understand)
  ↓
EDIT (change)
  ↓
TEST (verify)
  ↓
MEMORY (update)
```
Never jump to editing without reading. Never skip memory updates.

### ✅ Rule 4: Known Issues Belong in CLAUDE.md
When you fix a bug, add it to CLAUDE.md Known Issues section:
```markdown
### Issue 12: Task Skip Button Missing [Date: Feb 27, 2026]
**Error**: Tasks stuck in SKIPPED status forever
**Root Cause**: selectDailyTask() used `status: { not: "DONE" }` which included SKIPPED
**Solution**: Changed to `status: { notIn: ["DONE", "SKIPPED"] }`
**Files**: lib/ai/daily-task.ts
**Status**: ✅ Resolved
```

---

## Tool Reference Quick-Start

### 📚 When to Use Each Tool

| Tool | Use When | Example |
|------|----------|---------|
| **Memory** | Every task start/end | Read MEMORY.md first thing |
| **Tavily** | Need current data | "What's Linear's pricing now?" |
| **Playwright** | Testing UI/clicks | Verify checkout button works |
| **Context7** | Complex multi-file changes | Refactoring authentication system |
| **Zen/Open Router** | Making 10+ API calls | Batch roadmap regenerations |
| **Serena** | [Document after install] | TBD |

### 🎯 Decision Tree: Should I Use Playwright?

```
Is this UI-related?
├─ YES
│  ├─ Does user click something?
│  │  ├─ YES → Use Playwright
│  │  └─ NO → Just screenshot
│  └─ Is it payment/checkout?
│     └─ YES → MUST use Playwright
└─ NO → Don't use Playwright
```

### 🎯 Decision Tree: Should I Use Tavily?

```
Do I need current info (2026)?
├─ YES
│  ├─ Pricing/plans/competitors?
│  │  └─ YES → Use Tavily
│  ├─ Best practices for X?
│  │  └─ YES → Use Tavily
│  └─ Trend data?
│     └─ YES → Use Tavily
└─ NO → Use your knowledge + MEMORY
```

---

## The 3 Algorithms (TLDR)

### Algorithm 1: Planning (WHAT to do)
```
1. Check Memory (context check)
2. Classify task (bug/feature/research/refactor)
3. Research (if needed → use Tavily)
4. Scope assessment (small/medium/large)
5. LOCK plan into MEMORY.md BEFORE executing
```
👉 See ALGORITHMS.md sections: BUG_FIX_PLAN, FEATURE_PLAN, RESEARCH_PLAN, REFACTOR_PLAN

### Algorithm 2: Execution (HOW to do it)
```
1. VERIFY plan (re-read memory)
2. READ files (understand before changing)
3. EDIT files (one logical change per edit)
4. TEST (Playwright for UI, Bash for API)
5. DOCUMENT (update MEMORY.md immediately)
```
👉 See ALGORITHMS.md sections: Execution Patterns

### Algorithm 3: Memory Locking (WHEN to record)
```
After: Planning → lock plan
After: Architecture decision → lock decision
After: Bug fix → lock to CLAUDE.md + MEMORY.md
After: Feature → lock to MEMORY.md
After: Pattern discovery → lock to MEMORY.md
After: Blocker found → lock to MEMORY.md
```
👉 See ALGORITHMS.md section: Memory Locking Strategy

---

## What's Currently In Memory

### Status: MVP Complete (all 4 UI features built)
- ✅ Check-in page with coaching
- ✅ Security audit results
- ✅ Custom task creation
- ✅ Navigation improvements
- ✅ Animations (Framer Motion)

### Known Technical Patterns
- NextAuth v5 with database sessions (not JWT)
- Prisma schema for 6 models (User, Account, Repo, Task, TaskHistory, DailyTask)
- Claude Sonnet 4-6 for roadmap generation
- Claude Haiku 4-5 for daily task selection
- Stripe integration ready (need webhook handler)

### Known Issues (Already Solved)
- GitHub label type mismatch (fixed)
- JSON parsing from Claude (fixed)
- Task detail JSON parsing (fixed)
- NextAuth token retrieval (fixed)

---

## For Next Session: Starting Fresh

When you open this project again:
1. **Read MEMORY.md first** (2 min)
2. **Scan ALGORITHMS.md** section relevant to your task (5 min)
3. **Start planning phase** using the algorithm (10 min)
4. **Execute following tool order** (main work)
5. **Lock everything into MEMORY.md** (5 min)

That's it. The system is self-reinforcing.

---

## MCPs to Install (When Ready)

These tools are mentioned but not yet installed:
- [ ] Serena (workflow automation)
- [ ] Context7 (file dependency mapping)
- [ ] Tavily (research/search)
- [ ] Browser-Tools (browser automation)
- [ ] Playwright (web testing)
- [ ] Zen (Open Router integration)

**Status**: Documents ready, installation deferred

---

## Emergency Contacts

### If You Get Stuck
1. Pause (don't guess)
2. Search (Grep for similar code)
3. Read (understand the pattern)
4. Ask (if uncertain, ask user)
5. Document (what we learned)

### If Something Breaks
1. Stop (don't make more changes)
2. Read (understand what broke)
3. Root cause (why?)
4. Fix or revert
5. Test (verify it works)
6. Document (add to Known Issues)

### If Cost Is Too High
1. Trim inputs (shorter README, fewer files)
2. Use Haiku instead of Sonnet
3. Batch API calls (Zen/Open Router)
4. Cache results (don't regenerate)

---

## Success Criteria

✅ You know:
- Where to find algorithms (ALGORITHMS.md)
- When to update memory (after every task)
- What tool to use when (decision trees in ALGORITHMS.md)
- How to lock in findings (memory update template)
- What the current state is (MEMORY.md)

✅ System is working when:
- Memory grows but stays organized
- No surprises carry between sessions
- Similar tasks reuse patterns (faster each time)
- Bugs don't happen twice (locked in CLAUDE.md)
- New features build on established patterns

---

## Sign-Off

**This protocol is now ACTIVE.**

Every future task will follow these algorithms. Every finding will be locked into memory. Every session will start by reading MEMORY.md.

This is how we ship Meridian efficiently.

👉 **Next step**: Open a real task and apply the planning algorithm from ALGORITHMS.md

---

**Version**: 1.0
**Created**: Feb 27, 2026
**Status**: LOCKED IN
**Review Date**: [When 3+ MCPs installed]
