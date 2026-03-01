# Planning & Execution Algorithms
**Last Updated**: Feb 27, 2026 | **Status**: Active Protocol

---

## 1. PLANNING ALGORITHM (Decision Phase)

**Purpose**: Decide WHAT to work on and HOW to approach it

### Entry Point
```
START: User gives task or question
│
├─ STEP 1: Check Memory for Context
│  ├─ Read MEMORY.md (current state, blockers, patterns)
│  ├─ Check related topic files (debugging.md, patterns.md, etc.)
│  └─ If pattern exists → use it (SKIP to Execution)
│
├─ STEP 2: Classify Task Type
│  ├─ IF: Bug fix → go to BUG_FIX_PLAN
│  ├─ IF: New feature → go to FEATURE_PLAN
│  ├─ IF: Research/analysis → go to RESEARCH_PLAN
│  ├─ IF: Refactoring → go to REFACTOR_PLAN
│  └─ IF: Unknown → ask user for clarification
│
├─ STEP 3: Research Phase (if needed)
│  ├─ Check if Tavily search needed (competitor data, best practices)
│  ├─ If UI/browser testing needed → flag Playwright
│  ├─ If multi-file changes → flag Context7
│  └─ Record findings in memory IMMEDIATELY
│
├─ STEP 4: Scope Assessment
│  ├─ Small (1-2 files, <30 mins): Direct execution
│  ├─ Medium (3-5 files, <2 hrs): Create detailed plan in memory
│  ├─ Large (5+ files, team feature): Enter detailed planning mode
│  └─ Epic (architectural): Require user approval before starting
│
└─ STEP 5: Lock Plan into Memory
   └─ BEFORE executing, save plan to MEMORY.md:
      ```
      ## [TASK]: Feature/Bug Name [Status: PLANNING]
      **Description**: What are we doing
      **Why**: Impact on users/product
      **Files**: List of files to touch
      **Effort**: Estimated time
      **Blockers**: Known issues that might break us
      **Dependencies**: What needs to exist first
      **Next**: First concrete action
      ```
```

---

### BUG_FIX_PLAN
```
1. REPRODUCE
   └─ Can I see the bug myself?
      ├─ YES → Use Playwright to screenshot/record
      ├─ NO → Ask user for exact reproduction steps
      └─ Lock reproduction into memory

2. ROOT CAUSE
   └─ Hypothesize what's broken:
      ├─ Code logic error?
      ├─ Missing environment variable?
      ├─ Type mismatch?
      ├─ Race condition / async issue?
      ├─ Third-party API failure?
      └─ Save hypothesis in memory

3. VALIDATE HYPOTHESIS
   └─ Read code to confirm:
      ├─ Search files with Grep
      ├─ Trace execution path
      ├─ Check error messages
      └─ Update memory if hypothesis was wrong

4. FIX + TEST
   └─ Make minimal change
      ├─ Edit the file
      ├─ Test with Playwright if UI
      ├─ Check for side effects
      └─ LOCK fix + solution into CLAUDE.md + MEMORY.md
```

---

### FEATURE_PLAN
```
1. UNDERSTAND REQUIREMENTS
   └─ What does user want?
      ├─ Read message carefully
      ├─ Ask clarifying questions if vague
      ├─ Save requirements in memory
      └─ Get sign-off before proceeding

2. DESIGN SOLUTION
   └─ How will we build it?
      ├─ Check if pattern exists (search memory + codebase)
      ├─ If building on existing pattern → easy
      ├─ If new pattern → design first, get approval
      ├─ Decide: Client component? Server? API? Database change?
      └─ Save design in memory

3. DEPENDENCY CHECK
   └─ What needs to exist first?
      ├─ Database migration?
      ├─ New API endpoint?
      ├─ New component library?
      └─ If blockers exist → document them, ask user

4. IMPLEMENTATION PLAN
   └─ Break into steps:
      ├─ Step 1: Create data layer (DB + API)
      ├─ Step 2: Create UI layer (component)
      ├─ Step 3: Wire them together
      ├─ Step 4: Add error handling
      ├─ Step 5: Test end-to-end
      └─ Save plan in memory with file list

5. LOCK & EXECUTE
   └─ Save to memory, then go to EXECUTION
```

---

### RESEARCH_PLAN
```
1. IDENTIFY RESEARCH TYPE
   ├─ Competitor analysis? → Use Tavily
   ├─ Technical best practices? → Use Tavily + read docs
   ├─ User workflow verification? → Use Browser-Tools
   ├─ Integration testing? → Use Playwright
   └─ Architecture understanding? → Use Context7

2. GATHER DATA
   └─ Execute research:
      ├─ Tavily: Search for "X benchmark 2026", "Y pricing", "Z comparison"
      ├─ Browser: Screenshot current state, compare to target
      ├─ Playwright: Record interaction flow
      └─ Context7: Map dependencies

3. SYNTHESIZE FINDINGS
   └─ What does it mean?
      ├─ Extract actionable insights
      ├─ Identify gaps in our product
      ├─ Note patterns for future
      └─ LOCK findings into memory

4. PRESENT & DECIDE
   └─ Share with user:
      ├─ What we found
      ├─ What it means for Meridian
      ├─ Recommended action
      └─ Wait for user decision before proceeding
```

---

### REFACTOR_PLAN
```
1. UNDERSTAND CURRENT STATE
   └─ Use Context7 to snapshot:
      ├─ What files are involved?
      ├─ How do they depend on each other?
      ├─ What are the current patterns?
      └─ Save snapshot in memory

2. IDENTIFY IMPROVEMENTS
   └─ What's the pain?
      ├─ Code duplication?
      ├─ Performance bottleneck?
      ├─ Type safety issue?
      ├─ Maintainability problem?
      └─ Document in memory

3. DESIGN NEW STRUCTURE
   └─ How will it be better?
      ├─ What's the new pattern?
      ├─ How do files connect now?
      ├─ Will it break anything?
      ├─ Do we need database changes?
      └─ Save design in memory

4. RISK ASSESSMENT
   └─ What could go wrong?
      ├─ Existing tests that might fail?
      ├─ User-facing changes?
      ├─ Performance regression?
      └─ If HIGH RISK → get user approval

5. LOCK & EXECUTE
   └─ Save refactor plan to memory, then execute incrementally
```

---

## 2. EXECUTION ALGORITHM (Doing Phase)

**Purpose**: Actually build the thing (in the right order)

### Universal Execution Flow
```
START EXECUTION
│
├─ VERIFY PLAN
│  └─ Re-read memory to confirm:
│     ├─ What are we doing? ✓
│     ├─ Why are we doing it? ✓
│     ├─ Which files touch? ✓
│     └─ Any blockers? ✓
│
├─ READ PHASE (understand before changing)
│  └─ For each file in plan:
│     ├─ Read the entire file (Read tool)
│     ├─ Understand the current structure
│     ├─ Note dependencies
│     └─ Check for gotchas
│
├─ CHANGE PHASE (make edits in order)
│  └─ For each file modification:
│     ├─ Make ONE logical change (not multiple)
│     ├─ Use Edit tool (not Write - already read)
│     ├─ Keep changes minimal (avoid refactoring while fixing)
│     ├─ Test immediately if client-facing
│     └─ After EACH file: update memory with what changed
│
├─ TEST PHASE (verify nothing broke)
│  └─ If code changes:
│     ├─ TypeScript check (logical types)
│     ├─ Check for syntax errors
│     ├─ If UI: Use Playwright to test interaction
│     ├─ If API: Test with Bash curl/fetch
│     └─ If database: Check query structure
│
├─ DOCUMENT PHASE (lock learnings)
│  └─ IMMEDIATELY update:
│     ├─ CLAUDE.md (if fixing known issue)
│     ├─ MEMORY.md (what was done, why, what changed)
│     ├─ TodoWrite task (mark complete)
│     └─ Add any new patterns discovered
│
└─ DONE
   └─ Report to user:
      ├─ What was done
      ├─ What was changed
      ├─ Any side effects discovered
      └─ Ready for next task
```

---

### Execution Patterns by Task Type

#### PATTERN: Simple Bug Fix (1-2 files)
```
1. REPRODUCE & DIAGNOSE
   ├─ Read error message
   ├─ Find source file with Grep
   ├─ Read source file completely
   └─ Identify exact issue

2. FIX
   ├─ Edit file (minimal change)
   ├─ Test logic (trace through code mentally)
   └─ Check for side effects

3. DOCUMENT
   ├─ Add entry to CLAUDE.md (Known Issues)
   ├─ Update MEMORY.md with solution
   └─ Close task
```

---

#### PATTERN: API Endpoint (Server)
```
1. DESIGN ENDPOINT
   ├─ Read existing similar endpoint for pattern
   ├─ Define request shape (POST body / query params)
   ├─ Define response shape (JSON structure)
   ├─ Define error cases (401, 400, 500)
   └─ Note in memory

2. CREATE ROUTE FILE
   ├─ Check route path is available
   ├─ Copy structure from similar endpoint
   ├─ Implement: auth check → validate input → execute → return response
   ├─ Add error handling
   └─ Test with curl

3. WIRE TO DATABASE (if needed)
   ├─ Check Prisma schema (is model defined?)
   ├─ If not: add model, run migration
   ├─ If yes: write Prisma query in endpoint
   ├─ Test query returns expected data
   └─ Return from endpoint

4. TEST END-TO-END
   ├─ Use Bash to curl endpoint with test data
   ├─ Check response status code
   ├─ Check response JSON structure
   └─ Check database state (if applicable)

5. DOCUMENT
   ├─ Update MEMORY.md with endpoint details
   ├─ Note response schema
   └─ Update API summary if needed
```

---

#### PATTERN: UI Component (Client)
```
1. DESIGN COMPONENT
   ├─ Read similar component first
   ├─ Decide: "use client"? useState? useEffect?
   ├─ Define props (what data comes in?)
   ├─ Define behavior (what happens on click?)
   └─ Note in memory

2. WRITE COMPONENT
   ├─ Create file in components/ folder
   ├─ Import dependencies (React, icons, etc.)
   ├─ Export component with types
   ├─ Add Tailwind classes for styling
   ├─ Test mentally: does it handle null/undefined?
   └─ Test mentally: does it handle loading states?

3. MOUNT IN PAGE
   ├─ Find page where it should appear
   ├─ Import component
   ├─ Add to JSX (right location in DOM)
   ├─ Pass props (check props match)
   └─ Test in browser

4. WIRE TO DATA
   ├─ Component needs data? → from props
   ├─ Component triggers action? → call API
   ├─ Use fetch() with try/catch
   ├─ Handle loading, success, error states
   └─ Test interaction (click button, see result)

5. DOCUMENT
   ├─ Add to MEMORY.md (component purpose)
   ├─ Note props and behavior
   └─ Link to any related API endpoints
```

---

#### PATTERN: Database Migration
```
1. UNDERSTAND CURRENT SCHEMA
   ├─ Read prisma/schema.prisma
   ├─ Find relevant model
   ├─ Understand existing fields
   └─ Note relationships

2. PLAN CHANGES
   ├─ What field is being added/removed/modified?
   ├─ Will existing data be affected?
   ├─ Do we need a data migration script?
   └─ Note in memory

3. MODIFY SCHEMA
   ├─ Edit prisma/schema.prisma
   ├─ Add/remove/modify field
   ├─ Update relationships if needed
   ├─ Check TypeScript types (will need updates)
   └─ Save file

4. RUN MIGRATION
   ├─ Bash: npx prisma migrate dev --name "descriptive_name"
   ├─ Wait for migration to complete
   ├─ Check migration file created in prisma/migrations/
   ├─ If conflict: resolve manually
   └─ Test: can you query new field?

5. UPDATE APPLICATION CODE
   ├─ Find files that use this model
   ├─ Update TypeScript types
   ├─ Update Prisma queries (add new field if selecting)
   ├─ Update forms/API endpoints
   └─ Test that app still builds

6. DOCUMENT
   ├─ Add to MEMORY.md (migration purpose)
   ├─ Note files changed
   ├─ Link to migration file
   └─ Update schema diagram if exists
```

---

## 3. MEMORY LOCKING STRATEGY

**Critical**: Every significant action must be recorded in memory immediately

### Lock Points (When to Update Memory)

| Action | What to Lock | Where |
|--------|-------------|-------|
| Plan created | Plan details, reasoning, files affected | MEMORY.md (new section) |
| Architecture decision | Decision, alternatives considered, why | MEMORY.md (Architecture) |
| Bug fixed | Error, root cause, solution, files | CLAUDE.md (Known Issues) + MEMORY.md |
| Feature added | Feature name, files, how to use | MEMORY.md (Features) |
| Pattern discovered | Pattern, files, when to use | MEMORY.md (Patterns) |
| Dependency added | Package, version, why, where used | MEMORY.md (Dependencies) |
| Issue found | Issue, impact, workaround | MEMORY.md (Blockers) |

### Memory Update Template
```markdown
## [ACTION]: [Name] [Status: PENDING/COMPLETE]

**What**: Description of action
**Why**: Impact and rationale
**Files**: List of files touched
**Changes**: What changed (before → after)
**Lessons**: What we learned
**Links**: Related tasks, issues, PRs
**Status**: COMPLETE when finished
**Date**: YYYY-MM-DD
```

---

## 4. TOOL EXECUTION ORDER

**When you have a task, use tools in THIS order:**

### For Any Task
```
1. MEMORY (Read)
   └─ Consult MEMORY.md first for context

2. GREP (Search)
   └─ Find relevant code patterns

3. READ (Understand)
   └─ Read entire files before editing

4. EDIT (Change)
   └─ Make modifications

5. TEST (Verify)
   ├─ Playwright (if UI)
   ├─ Bash (if API)
   └─ Logic check (if algorithm)

6. MEMORY (Write/Update)
   └─ Lock findings and changes immediately

7. TAVILY (if research)
   └─ Only when research is needed (not first)

8. CONTEXT7 (if complex)
   └─ Only when mapping 5+ file dependencies

9. PLAYWRIGHT (if recording)
   └─ Only when documenting user workflows
```

### For Research Tasks
```
1. MEMORY (what does user want?)
2. TAVILY (search for answer)
3. MEMORY (lock findings)
4. BROWSER (if need screenshots)
5. REPORT to user
```

### For Feature Development
```
1. MEMORY (check similar features)
2. PLAN (design in memory)
3. READ (understand related code)
4. EDIT (implement)
5. PLAYWRIGHT (test if UI)
6. MEMORY (lock implementation)
```

---

## 5. DECISION TREES

### Should I use Playwright?
```
Is this change UI-related?
├─ YES → Does user need to click/interact?
│        ├─ YES → Use Playwright to test
│        ├─ NO → Take screenshot only
│        └─ If checkout/payment → MUST test
└─ NO → Don't use Playwright
```

### Should I use Tavily?
```
Do I need current information?
├─ YES → Is it factual (pricing, trends, competitors)?
│        ├─ YES → Use Tavily search
│        ├─ NO → Use MEMORY + documentation
│        └─ If over 6 months old → refresh with Tavily
└─ NO → Use existing knowledge + MEMORY
```

### Should I update CLAUDE.md?
```
Did I fix a known issue or discover something new?
├─ Bug fix? → Add to "Known Issues & Decisions"
├─ Architecture decision? → Add to "Architecture Decisions"
├─ Performance insight? → Add to "Lessons & Observations"
├─ New pattern? → Document in MEMORY.md instead
└─ If uncertain → Update MEMORY.md first, CLAUDE.md later
```

---

## 6. EMERGENCY PROTOCOLS

### If Something Breaks
```
1. STOP (don't make more changes)
2. READ (understand what broke)
3. ROOT CAUSE (why did it break?)
4. REVERT (if needed) or FIX
5. TEST (verify it works)
6. DOCUMENT (add to Known Issues)
7. CONTINUE
```

### If You're Stuck
```
1. PAUSE (don't guess)
2. SEARCH (Grep for similar code)
3. READ (understand the pattern)
4. RESEARCH (Tavily if external)
5. ASK USER (if unsure)
6. DOCUMENT (what we learned)
```

### If Cost is Too High
```
Current: Reading $0.003/1K tokens, writing $0.015/1K
├─ Trim README (if > 1200 chars)
├─ Reduce file tree (if > 15 files)
├─ Batch API calls (use Zen/Open Router)
├─ Use Haiku for cheap operations
└─ Cache results (don't regenerate)
```

---

## Sign-Off

**Version**: 1.0
**Created**: Feb 27, 2026
**Status**: Active
**Last Review**: [TBD]

This is the system. Follow it. Lock everything into memory.
