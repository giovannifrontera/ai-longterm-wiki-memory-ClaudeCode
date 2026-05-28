# CLAUDE.md — ai-longterm-wiki-memory-ClaudeCode

Questo repo fornisce il wiki memory system per Claude Code CLI via MCP server + hook UserPromptSubmit.

## Installazione

```bash
node installer/dist/install.js --workspace /path/assoluto/al/workspace
```

Riavvia Claude Code dopo l'installazione.

## Architettura

- `mcp-server/` — TypeScript MCP server (4 tool: wiki_query, wiki_ingest, wiki_lint, wiki_serve)
- `scripts/` — backend Python (wiki.py, wiki_context.py, ...)
- `installer/` — CLI che scrive hook e mcpServers in .claude/settings.json

## Come funziona

Ogni prompt riceve automaticamente un blocco `<wiki-context>` con le pagine wiki più rilevanti (via hook UserPromptSubmit). I tool MCP sono disponibili per operazioni attive (ingest, lint, serve).

Quando vedi `<wiki-context>` nel contesto: usalo direttamente, non chiamare wiki_query di nuovo.
