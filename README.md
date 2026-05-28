<div align="center">

# AI Longterm Wiki Memory — Claude Code

**Claude Code ricorda tutto tra una sessione e l'altra.**

Ogni volta che scrivi un prompt, le pagine wiki più rilevanti vengono iniettate automaticamente nel contesto — senza che tu faccia nulla. Puoi anche chiedere a Claude di aggiungere, cercare o manutenere la tua base di conoscenza direttamente dalla chat.

[![Version](https://img.shields.io/badge/version-0.1.0-informational)](#)
[![Tests](https://img.shields.io/badge/tests-16%20passed-brightgreen)](mcp-server/tests/)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-orange)](https://claude.ai/code)

</div>

---

## Il problema

Claude Code dimentica tutto tra una sessione e l'altra. Ogni volta che riapri il terminale devi rispiegare il contesto, riesumare le decisioni prese, ricordare come funziona il progetto. Se stai lavorando su qualcosa di ricorrente — ricerca, codice, analisi — questo diventa un attrito costante.

## La soluzione

Un wiki personale che Claude legge **automaticamente** prima di risponderti. Tu scrivi le conoscenze che vuoi che ricordi; il sistema le recupera per similarità semantica e le mette nel contesto senza che tu le chieda.

```
Scrivi un prompt
       │
       ▼
wiki_context.py cerca le pagine più rilevanti nel tuo wiki
       │
       ▼
Claude legge il contesto → risponde sapendo già quello che sa
```

Dopo l'installazione non cambia nulla nel tuo modo di lavorare. Claude ha semplicemente più contesto.

---

## Installazione

### 1. Prerequisiti

- [Claude Code CLI](https://claude.ai/code)
- Node.js 20+
- Python 3.10+ con lancedb:
  ```bash
  pip install lancedb sentence-transformers
  ```

### 2. Clona il repo

```bash
git clone https://github.com/giovannifrontera/ai-longterm-wiki-memory-ClaudeCode
cd ai-longterm-wiki-memory-ClaudeCode
```

### 3. Build

```bash
cd mcp-server && npm install && npm run build && cd ..
cd installer && npm install && npm run build && cd ..
```

### 4. Prepara il workspace

Il workspace è una directory qualsiasi dove verranno salvate le tue pagine wiki. Copia il file di configurazione di esempio:

```bash
cp wiki.config.json.example /percorso/al/tuo/workspace/wiki.config.json
```

Apri `wiki.config.json` e imposta `"workspace"` con il percorso assoluto della directory.

### 5. Installa

```bash
node installer/dist/install.js --workspace /percorso/assoluto/al/workspace
```

L'installer rileva automaticamente il Python corretto e scrive la configurazione in `.claude/settings.json`.

### 6. Riavvia Claude Code

Da questo momento, ogni prompt includerà automaticamente le pagine wiki rilevanti.

---

## Cosa puoi fare dalla chat

Una volta installato, puoi parlare con Claude come al solito. In più:

| Dici a Claude... | Claude fa... |
|-----------------|--------------|
| "Ricorda che in questo progetto usiamo X" | Scrive una pagina wiki con quella conoscenza |
| "Cosa sai su Y?" | Cerca nel wiki e risponde con le pagine trovate |
| "Apri la dashboard del wiki" | Avvia `http://localhost:7331` con il grafo delle pagine |
| "Fai manutenzione al wiki" | Trova e ripara vettori stale, duplicati, link rotti |

---

## Dashboard

```bash
# oppure chiedi direttamente a Claude: "apri la dashboard"
wiki.py serve --workspace /percorso/al/workspace
```

Apri `http://localhost:7331` — grafo interattivo delle pagine, statistiche di copertura, pagine più usate.

---

## Opzioni installer

```
--workspace <path>   Percorso assoluto al workspace (obbligatorio)
--k <n>              Pagine da iniettare per prompt (default: 3)
--python <exe>       Eseguibile Python (auto-rilevato se omesso)
--global             Installa in ~/.claude/settings.json
--dry-run            Mostra la configurazione senza scrivere
--uninstall          Rimuove hook e MCP server
```

---

## Come funziona (per chi vuole sapere)

L'installazione aggiunge due cose a `.claude/settings.json`:

**Hook automatico** — prima di ogni tuo prompt, viene eseguito `wiki_context.py` che cerca le 3 pagine semanticamente più vicine nel tuo wiki (LanceDB + embeddings bge-m3) e le prepende come `<wiki-context>`.

**MCP server** — quattro tool (`wiki_query`, `wiki_ingest`, `wiki_lint`, `wiki_serve`) che Claude può chiamare esplicitamente per operazioni attive sul wiki.

I due canali sono indipendenti: se uno smette di funzionare, l'altro continua.

---

## Vuoi usarlo con OpenClaw?

Questo repo è l'integrazione per Claude Code CLI. Se usi OpenClaw (Telegram, Discord, web), vedi [`ai-longterm-wiki-memory-OpenClaw`](https://github.com/giovannifrontera/ai-longterm-wiki-memory-OpenClaw) — stesso sistema, adattatore diverso.

---

## Licenza

AGPL-3.0

<div align="center">

Embeddings: [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) · Vector store: [LanceDB](https://lancedb.github.io/lancedb/)

</div>
