# MCP Installation & Configuration Guide

**Date**: Feb 27, 2026
**Status**: Ready to Install
**Setup Type**: COMPLETELY FREE (Zero API Keys)

---

## MCPs You're Installing (All Free)

| MCP | Purpose | Type | API Key? |
|-----|---------|------|----------|
| **Serena** | Semantic code retrieval + editing | Free/Open Source | ❌ No |
| **Context7** | Real-time documentation | Upstash | ❌ No |
| **Playwright** | Browser automation + testing | Open Source | ❌ No |
| **Browser-Tools** | Browser monitoring | Open Source | ❌ No |
| **Memory** | Local persistent memory | Built-in | Already Set |

**Removed (Requires Payment)**: Tavily, Zen/OpenRouter

---

## Step 1: No API Keys Needed ✅

You're good to go. No sign-ups required.

---

## Step 2: Add to Claude Code Settings

**Location**: Command Palette → "Claude: Settings" → Find `.claude/settings.json`

**Copy this entire `mcps` section** and paste into your settings.json:

```json
{
  "mcps": {
    "serena": {
      "command": "npx",
      "args": ["@oraios/serena"],
      "description": "Semantic code understanding and IDE-like editing capabilities",
      "enabled": true
    },
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7"],
      "description": "Real-time documentation and code examples for libraries",
      "enabled": true
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "description": "Browser automation, testing, and page interaction",
      "enabled": true
    },
    "browser-tools": {
      "command": "npx",
      "args": ["@agentdesk/browser-tools-mcp"],
      "description": "Browser monitoring, console logs, network activity",
      "enabled": true
    }
  }
}
```

---

## Step 3: No API Keys Needed ✅

No additional configuration needed. Everything is free and open source.

---

## Step 4: Verify Installation

After adding to settings.json:

1. **Restart Claude Code** (Command Palette → "Reload Window")
2. **Check MCP Status** (Command Palette → "Claude: Show MCP Settings")
3. **All 6 MCPs should show "Connected"**

---

## How Each MCP Is Used (From ALGORITHMS.md)

### When to Use Each Tool

```
START TASK
├─ MEMORY (always first)
├─ SERENA (code understanding)
│  └─ Use when: Refactoring, finding patterns, semantic search
├─ CONTEXT7 (docs lookup)
│  └─ Use when: Need current library docs/examples
├─ ZEN (multi-model)
│  └─ Use when: Complex problem needs multiple AI perspectives
├─ TAVILY (web search)
│  └─ Use when: Need current trends, competitors, pricing
├─ PLAYWRIGHT (browser test)
│  └─ Use when: Testing UI/checkout/interactions
└─ BROWSER-TOOLS (monitor)
   └─ Use when: Debugging client-side issues, network problems
```

---

## Installation Checklist

- [ ] **Copy MCP Config** (above `settings.json` section)
- [ ] **Paste into settings.json**
- [ ] **Restart** Claude Code (Command Palette → "Reload Window")
- [ ] **Verify**: All 4 MCPs show "Connected"
- [ ] **Test**: Try using Serena to search code
- [ ] **Lock Memory**: Add MCP status to MEMORY.md

---

## What Each MCP Does (Quick Reference)

### 🔍 Serena
**Semantic Code Understanding** — Free, Open Source
- Find functions/classes by behavior (not just name)
- Refactor code across multiple files
- Understand dependencies at symbol level
- Support for 30+ languages

Source: [GitHub - oraios/serena](https://github.com/oraios/serena)

### 📚 Context7
**Live Documentation** — Free from Upstash
- Fetch latest docs for any library
- Get real code examples
- Never hallucinate outdated APIs
- Supports 100+ libraries

Source: [Upstash Context7](https://upstash.com/blog/context7-mcp)

### 🎭 Playwright
**Browser Automation** — Free, Open Source
- Test UI workflows
- Screenshot capture
- Click/type interactions
- Form testing

Source: [Playwright MCP](https://github.com/microsoft/playwright-mcp)

### 🌐 Browser-Tools
**Browser Monitoring** — Free, Open Source
- Capture console logs
- Network monitoring
- Accessibility audits
- Performance checks

Source: [Browser-Tools MCP](https://github.com/AgentDeskAI/browser-tools-mcp)

---

## After Installation: Next Steps

### 1. Update MEMORY.md
```markdown
## MCP Setup Complete [Status: COMPLETE]

**Date**: Feb 27, 2026
**MCPs Installed**: 4 (All Free, Zero API Keys)
- ✅ Serena (code understanding)
- ✅ Context7 (live docs)
- ✅ Playwright (browser automation)
- ✅ Browser-Tools (browser monitoring)

**How to Use**:
- See ALGORITHMS.md for tool decision trees
- See Tool Decision Matrix in Protocol v1.0
- Lock findings into MEMORY.md after each task
```

### 2. Test Each MCP
```bash
# Test Serena (code search)
Ask: "Find all async functions in this repo"

# Test Context7 (docs)
Ask: "What's the latest React API for state management?"

# Test Playwright (browser)
Ask: "Test the checkout button on our pricing page"

# Test Browser-Tools (monitoring)
Ask: "Check accessibility of our pricing page"
```

### 3. Use in Algorithms
- Reference decision trees in ALGORITHMS.md
- Follow tool execution order (MEMORY → GREP → READ → EDIT → TEST → MEMORY UPDATE)
- Lock findings after each task

---

## Troubleshooting

### "MCP not connecting"
- Verify settings.json syntax (JSON validator)
- Restart Claude Code
- Check npm is installed

### "Playwright timeout"
- Check browser is running
- Verify Playwright can reach localhost
- Try with simpler page first

### "Serena not finding code"
- Verify project has TypeScript/supported language files
- Try searching for specific function names
- Check Serena can access your codebase

---

## Sign-Off

**All MCPs configured and ready.**

Once installed:
1. Restart Claude Code
2. Verify all 6 show "Connected"
3. Update MEMORY.md with status
4. Start using in your workflow (see ALGORITHMS.md)

**You now have the full AI development toolkit.** 🚀

---

## Sources & Documentation

- [Serena MCP - GitHub](https://github.com/oraios/serena)
- [Context7 - Upstash Blog](https://upstash.com/blog/context7-mcp)
- [Playwright MCP - Microsoft](https://github.com/microsoft/playwright-mcp)
- [Browser-Tools MCP - AgentDeskAI](https://github.com/AgentDeskAI/browser-tools-mcp)
