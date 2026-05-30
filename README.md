<div align="center">

# AI Longterm Wiki Memory

### Persistent Semantic Memory for Autonomous Agents

**AI Longterm Wiki Memory** is a framework that provides AI agents with a structured, self-healing knowledge base. It transforms session-based interactions into a compounding external brain.

[Philosophy](#the-three-layer-brain) · [Capabilities](#features) · [Architecture](#technical-architecture) · [Quick Start](#quick-start)

</div>

---

## The Three-Layer Brain

Most agents operate on a stateless "Oracle" model. This framework implements a hierarchical memory structure that mimics human cognitive persistence:

1.  **Domain Layer:** Deep, specialized knowledge extracted from PDFs, papers, and web sources.
2.  **Distilled Layer:** Cross-domain concepts autonomously promoted based on retrieval frequency.
3.  **Identity Layer:** Behavioral patterns and values learned from user feedback and self-reflection.

---

## Features

*   **Atomic Semantic Ingest:** Page creation and vector embedding (`bge-m3`) occur in a single crash-safe operation.
*   **Pre-Prompt Context Injection:** A vector-search hook runs before every prompt, ensuring the agent is always grounded in relevant context.
*   **Self-Healing Lint:** Automatic detection and repair of broken links, orphan vectors, and semantic duplicates.
*   **Autonomous Promotion:** Knowledge that proves useful across multiple domains is autonomously moved to the core wiki.

---

## Technical Architecture

The system uses a **Dual-Representation Pattern**:

*   **Human-Readable:** Markdown files for transparency and manual curation.
*   **Machine-Retrievable:** LanceDB vector store for high-recall semantic retrieval.

A background **Self-Reflection** process periodically analyzes session logs to update the agent's behavioral identity, ensuring a truly personalized experience.

---

## Quick Start

### Installation
```bash
git clone https://github.com/giovannifrontera/ai-longterm-wiki-memory-ClaudeCode
cd ai-longterm-wiki-memory-ClaudeCode
pip install -r requirements.txt
```

### Usage (Claude Code)
```bash
cp skills/wiki-core.md ~/.claude/skills/
```

---

*Part of the **[AI-Wiki Ecosystem](https://github.com/giovannifrontera/giovannifrontera)** · Developed by Giovanni Frontera, Ph.D.*
