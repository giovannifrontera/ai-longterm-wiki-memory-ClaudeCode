<div align="center">

# 🧬 ai-longterm-wiki-memory-ClaudeCode

### Persistent semantic memory for autonomous AI agents

[![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-cc785c?style=flat-square&logo=anthropic&logoColor=white)](https://claude.ai/code)
[![LanceDB](https://img.shields.io/badge/LanceDB-embedded-e05d2a?style=flat-square)](https://lancedb.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/giovannifrontera/ai-longterm-wiki-memory-ClaudeCode?style=flat-square)](https://github.com/giovannifrontera/ai-longterm-wiki-memory-ClaudeCode/commits)

[Problem](#-the-problem) · [Theory](#-theoretical-framework) · [Architecture](#-three-layer-architecture) · [Tech](#-technical-deep-dive) · [Quick Start](#-quick-start) · [Ecosystem](#-ai-wiki-ecosystem)

</div>

---

## 🎯 The Problem

Every Claude Code session begins in a state of **total amnesia**. The agent has no memory of the project history, no recall of previous decisions, no awareness of recurring patterns. The cognitive cost of re-establishing context from scratch — re-reading files, re-explaining conventions, re-discovering pitfalls — is paid anew at the start of every session.

This is not merely inefficient. It fundamentally limits the class of tasks an AI agent can perform. Long-horizon research, iterative design, and longitudinal knowledge synthesis all require the kind of persistent, associative memory that current LLM context windows cannot provide on their own.

**ai-longterm-wiki-memory-ClaudeCode** implements an *extended mind* for AI agents (Clark & Chalmers, 1998): a structured, self-healing external knowledge base that persists across sessions, compounds over time, and retrieves relevant context automatically — before every prompt.

---

## 📚 Theoretical Framework

### Extended Mind Thesis (Clark & Chalmers, 1998)
If a notebook that Otto carries functions as part of his memory — directing his behaviour as reliably as biological memory would — then it counts as part of his cognitive system (Clark & Chalmers, 1998). This framework applies directly: the wiki-memory system extends the agent's effective cognitive reach beyond the context window, functioning as a genuine component of its reasoning apparatus.

### Tulving's Episodic and Semantic Memory
Tulving (1972) distinguishes between *episodic memory* (time-stamped events: "what happened in this session") and *semantic memory* (general knowledge: "what RAG means"). The three-layer architecture maps directly onto this distinction: the Domain layer stores semantic knowledge, the Identity layer stores episodic patterns, and the Distilled layer manages the transition from episodic to semantic through autonomous promotion.

### Distributed Cognition (Hutchins, 1995)
Hutchins demonstrated that cognition is not confined to individual minds — it is distributed across people, tools, and artefacts in a system. The wiki-memory system externalises cognitive work into a distributed structure: the agent, the Markdown wiki, the vector index, and the hook system form a single cognitive unit.

### Ebbinghaus Forgetting Curve
Without reinforcement, information decays exponentially (Ebbinghaus, 1885). The self-healing lint and autonomous promotion mechanisms operationalise spaced repetition at the system level: frequently retrieved knowledge is promoted to more accessible layers; stale knowledge is flagged for review.

---

## 🏗 Three-Layer Architecture

```mermaid
flowchart TD
    subgraph Domain Layer
        D1[PDF / paper ingest]
        D2[Web source ingest]
        D3[Session observations]
    end

    subgraph Distilled Layer
        DI[Cross-domain concepts\npromoted by retrieval frequency]
    end

    subgraph Identity Layer
        ID[Behavioural patterns\nUser preferences\nSelf-reflection logs]
    end

    Domain Layer -->|autonomous promotion\nthreshold N retrievals| Distilled Layer
    Distilled Layer -->|identity extraction\nself-reflection| Identity Layer

    H[Hook System] -->|SessionStart| S1[Pre-prompt context injection\nvector search → top-K pages]
    H -->|PostToolUse| S2[Observation capture\nfile reads · edits · commands]
    H -->|Stop| S3[Session compression\nAI-summarised observations]

    S1 --> Domain Layer
    S2 --> Domain Layer
    S3 --> Identity Layer
```

### Atomic Semantic Ingest
Every ingest operation is **crash-safe**: page creation and vector embedding occur in a single atomic sequence. If the process is interrupted, the next startup runs `cleanup_orphans()` to detect and remove any partial writes. The state of the wiki is always internally consistent.

### Pre-Prompt Context Injection
Before every Claude Code prompt, the SessionStart hook performs a semantic search against the full wiki and injects the top-K most relevant pages as system context. This gives the agent immediate access to relevant knowledge without requiring any manual intervention.

### Autonomous Promotion
Knowledge that proves useful across multiple domains — retrieved frequently, cited across different research contexts — is automatically promoted from the Domain layer to the Distilled layer. This mimics the consolidation of procedural memory: facts that are used often become more accessible over time.

---

## 🔬 Technical Deep-Dive

### LanceDB Schema

```
wiki_pages table:
  id           STRING  PRIMARY KEY   -- path relative to wiki root
  title        STRING
  category     STRING                -- entities | concepts | synthesis | identity | raw
  content      STRING                -- markdown body (truncated to 2000 chars for storage)
  project      STRING                -- source project/domain
  last_modified FLOAT               -- Unix timestamp (for age-based decay)
  vector       FLOAT[1024]          -- bge-m3 embedding
```

### Hook Configuration (`~/.claude/settings.json`)

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{ "type": "command", "command": "python ~/.wiki-memory/hooks/session_start.py" }]
    }],
    "PostToolUse": [{
      "matcher": ".*",
      "hooks": [{ "type": "command", "command": "python ~/.wiki-memory/hooks/post_tool_use.py" }]
    }],
    "Stop": [{
      "matcher": "",
      "hooks": [{ "type": "command", "command": "python ~/.wiki-memory/hooks/session_end.py" }]
    }]
  }
}
```

### Self-Healing Lint
The lint engine runs periodically and detects three classes of degradation:

| Issue | Detection | Repair |
|---|---|---|
| **Broken wiki links** | Regex scan for `[[target]]` with no matching file | Log orphan links, flag for manual review |
| **Orphan vectors** | LanceDB IDs not present in filesystem | Delete stale vector records |
| **Semantic duplicates** | Cosine similarity > 0.95 between two pages | Flag pair for merge or deletion |

### Knowledge Graph UI
The frontend renders the wiki as a **D3.js force-directed graph**: nodes represent pages (coloured by category, sized by retrieval frequency), edges represent semantic links above a configurable similarity threshold. The graph provides an immediate visual understanding of the knowledge structure and highlights under-connected areas that may benefit from new ingest.

---

## 🏛 Architectural Decisions

**Markdown-first over pure vector:** Markdown files are human-readable, Git-trackable, and editable without special tooling. Researchers can audit, correct, and manually curate the knowledge base at any time. The vector index is a derived artefact — it can always be rebuilt from the Markdown source.

**Promotion threshold:** The autonomous promotion threshold (default: 3 retrievals across 2 different domains) is deliberately conservative. Premature promotion of domain-specific knowledge to the Distilled layer would pollute cross-domain context injection with irrelevant results.

**Self-reflection cadence:** The Identity layer is updated at session end, not in real time. Real-time identity updates would create feedback loops where the agent's current behaviour immediately reinforces itself, preventing the stabilisation of genuine long-term patterns.

---

## ⚠️ Known Limitations

- **No transactional semantics:** LanceDB does not support rollback. If an ingest is interrupted after vector write but before Markdown write, orphan vectors accumulate until the next lint run.
- **Hook latency:** The SessionStart hook performs a network-free local ANN search, but the first run after a large ingest may be slow (cold LanceDB index).
- **Single-machine:** The current architecture is designed for a single researcher's local machine. Shared team wikis would require a centralised LanceDB instance or a REST API layer.

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/giovannifrontera/ai-longterm-wiki-memory-ClaudeCode
cd ai-longterm-wiki-memory-ClaudeCode
pip install -r requirements.txt

# Install the core skill
cp skills/wiki-core.md ~/.claude/skills/

# Configure hooks (adds SessionStart, PostToolUse, Stop)
python scripts/install_hooks.py
```

### First Ingest

```bash
# Ingest a PDF or directory of papers
python ingest.py --source path/to/paper.pdf --project my-research

# Verify the wiki structure
python lint.py --report

# Open the knowledge graph
open http://localhost:8080  # after: python serve.py
```

### Verify Context Injection

Open a new Claude Code session in any project. The SessionStart hook will automatically inject relevant wiki context into the system prompt. You should see a log line:

```
[wiki-memory] Injected 5 pages (top-K=5, query: inferred from project context)
```

---

## 🌐 AI-Wiki Ecosystem

This project is part of a coherent research toolchain for AI-augmented academic knowledge management:

| Project | Role |
|---|---|
| [ai-wiki-graph-RAG-lms](https://github.com/giovannifrontera/ai-wiki-graph-RAG-lms) | LTI 1.3 backend — transforms course materials into a navigable wiki with RAG and knowledge graph |
| **ai-longterm-wiki-memory-ClaudeCode** ← *you are here* | Persistent semantic memory — the memory engine that powers long-horizon AI research |
| [academic-PRISMA-research-workflow](https://github.com/giovannifrontera/academic-PRISMA-research-workflow) | Systematic review automation — feeds evidence-based content into the wiki ecosystem |

---

## 📖 References

1. Clark, A., & Chalmers, D. (1998). The extended mind. *Analysis*, 58(1), 7–19. https://doi.org/10.1093/analys/58.1.7
2. Tulving, E. (1972). Episodic and semantic memory. In E. Tulving & W. Donaldson (Eds.), *Organization of Memory* (pp. 381–403). Academic Press.
3. Hutchins, E. (1995). *Cognition in the Wild*. MIT Press.
4. Ebbinghaus, H. (1885). *Über das Gedächtnis: Untersuchungen zur experimentellen Psychologie*. Duncker & Humblot.
5. Atkinson, R. C., & Shiffrin, R. M. (1968). Human memory: A proposed system and its control processes. *Psychology of Learning and Motivation*, 2, 89–195.

---

<div align="center">

*Developed by [Giovanni Frontera, Ph.D.](https://github.com/giovannifrontera) · Part of the AI-Wiki Ecosystem*

</div>
