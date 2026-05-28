<div align="center">

# AI Longterm Wiki Memory — Claude Code

**Native MCP integration for Claude Code CLI**

Long-term semantic memory for Claude Code — auto-injects relevant wiki pages before every prompt via `UserPromptSubmit` hook, and exposes wiki operations as native MCP tools.

[![Version](https://img.shields.io/badge/version-0.1.0-informational)](CHANGELOG.md)
[![Tests](https://img.shields.io/badge/tests-16%20passed-brightgreen)](mcp-server/tests/)
[![Node](https://img.shields.io/badge/node-20%2B-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)
[![Claude Code](https://img.shields.io/badge/works%20with-Claude%20Code-orange)](https://claude.ai/code)

[Quick Start](#quick-start) · [Architecture](#architecture) · [MCP Tools](#mcp-tools) · [CLI Reference](#cli-reference)

---

</div>

> **Looking for the OpenClaw plugin?** See [`ai-longterm-wiki-memory-OpenClaw`](https://github.com/giovannifrontera/ai-longterm-wiki-memory-OpenClaw).

## What it does

Every Claude Code prompt automatically receives a `<wiki-context>` block with the most semantically relevant pages from your personal wiki — **before** you even finish typing. When you need to actively manage the wiki, four MCP tools are available directly in the conversation.

```
User types a prompt
        │
        ▼
UserPromptSubmit hook → wiki_context.py → LanceDB top-k search
        │
        ▼
<wiki-context> block prepended — Claude has your knowledge
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.10+ with lancedb (`pip install lancedb sentence-transformers`)
- Claude Code CLI
- A wiki workspace (see [ai-longterm-wiki-memory-OpenClaw](https://github.com/giovannifrontera/ai-longterm-wiki-memory-OpenClaw) to create one)

### Build

```bash
cd mcp-server && npm install && npm run build
cd ../installer && npm install && npm run build
```

### Install

```bash
node installer/dist/install.js --workspace /absolute/path/to/your/wiki
```

The installer auto-detects the Python executable that can import `lancedb` — no manual path needed.

Restart Claude Code. Done.

### Verify

Open Claude Code in any directory and type a prompt. You should see a `<wiki-context>` block in the injected context. Try asking Claude to use `wiki_query` to search for something in your wiki.

---

## Architecture

```
ai-longterm-wiki-memory-ClaudeCode/
├── mcp-server/          ← TypeScript MCP server
│   ├── src/
│   │   ├── index.ts     ← entry point: parses --workspace, wires 4 tools
│   │   ├── bridge.ts    ← execFile wrapper: runs Python scripts async
│   │   └── tools/
│   │       ├── wiki_query.ts
│   │       ├── wiki_ingest.ts
│   │       ├── wiki_lint.ts
│   │       └── wiki_serve.ts
│   └── dist/            ← compiled output
│
├── installer/           ← CLI installer
│   └── install.ts       ← auto-detects Python, writes hook + mcpServers
│
├── scripts/             ← Python backend (wiki.py, wiki_context.py, ...)
└── wiki.config.json.example
```

**Two independent channels:**

| Channel | Trigger | What it does |
|---------|---------|--------------|
| Hook (`UserPromptSubmit`) | Every prompt, automatically | Runs `wiki_context.py`, prepends `<wiki-context>` |
| MCP tools | When Claude calls them | Runs `wiki.py` commands (ingest, lint, serve, query) |

If the hook fails, MCP tools still work. If MCP is unavailable, the hook still injects context.

---

## MCP Tools

| Tool | Python script | Description |
|------|--------------|-------------|
| `wiki_query` | `wiki_context.py` | Search for relevant wiki pages by semantic query |
| `wiki_ingest` | `wiki.py ingest` | Add structured knowledge pages to the wiki |
| `wiki_lint` | `wiki.py lint` | Find and fix stale vectors, broken links, duplicates |
| `wiki_serve` | `wiki.py serve` | Launch the wiki dashboard at `http://localhost:7331` |

When `<wiki-context>` is already in the prompt context, use it directly — do not call `wiki_query` again for the same query.

---

## Installer CLI Reference

```bash
node installer/dist/install.js [options]

Options:
  --workspace <path>    Required. Absolute path to the wiki workspace.
  --k <n>              Chunks to inject per prompt (default: 3).
  --python <exe>       Python executable override (auto-detected if omitted).
  --global             Install into ~/.claude/settings.json instead of local.
  --dry-run            Preview settings.json output without writing.
  --uninstall          Remove hook and mcpServers entry.
```

**Python auto-detection:** tries `py`, `python`, `python3` (Windows) or `python3`, `python` (Linux/macOS) in order, picks the first that can `import lancedb`.

---

## Manual MCP registration (alternative to installer)

```bash
claude mcp add wiki-context -- node /absolute/path/to/mcp-server/dist/index.js --workspace /absolute/path/to/wiki
```

---

## License

AGPL-3.0

---

<div align="center">

Works with [Claude Code](https://claude.ai/code) · Embeddings by [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) · Vector store by [LanceDB](https://lancedb.github.io/lancedb/) · Backend: [ai-longterm-wiki-memory-OpenClaw](https://github.com/giovannifrontera/ai-longterm-wiki-memory-OpenClaw)

</div>
