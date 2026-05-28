# Installazione — Claude Code

## Prerequisiti

- Node.js 20+
- Python con lancedb installato (`py -m pip install lancedb sentence-transformers` su Windows)
- Claude Code CLI

## Build

```bash
cd mcp-server && npm install && npm run build
cd ../installer && npm install && npm run build
```

## Installa

```bash
node installer/dist/install.js --workspace /path/assoluto/al/wiki
```

Opzioni: `--k 3`, `--python py`, `--global`, `--dry-run`, `--uninstall`.

## Verifica

Riavvia Claude Code e digita un prompt qualsiasi. Dovresti vedere `<wiki-context>` nel contesto iniettato.

## Registra il MCP server manualmente (opzionale)

```bash
claude mcp add wiki-context -- node /path/to/mcp-server/dist/index.js --workspace /path/to/wiki
```
