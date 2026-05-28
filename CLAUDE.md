# CLAUDE.md — ai-longterm-wiki-memory-ClaudeCode

> **Se sei un agente Claude Code:** questo file contiene le istruzioni per installare il sistema. Leggilo prima di qualsiasi altra azione.

---

## Installazione guidata da agente

Se l'utente ti chiede di installare il wiki system, segui questi passi nell'ordine esatto.

---

### Step 1 — Verifica prerequisiti

```bash
node --version          # deve essere 20+
```

Per Python, prova in ordine finché uno funziona:
```bash
py -c "import lancedb; print('lancedb ok')"       # Windows
python -c "import lancedb; print('lancedb ok')"   # Linux/macOS
python3 -c "import lancedb; print('lancedb ok')"  # Linux/macOS alternativo
```

Se lancedb non è installato, usa lo stesso eseguibile che funziona:
```bash
py -m pip install lancedb sentence-transformers       # Windows
python -m pip install lancedb sentence-transformers   # Linux/macOS
```

Non procedere finché `import lancedb` non stampa `lancedb ok`. Annota l'eseguibile che ha funzionato (`py`, `python`, o `python3`) — serve al Step 4.

---

### Step 2 — Chiedi dove salvare la conoscenza

Chiedi all'utente:

> "Dove vuoi salvare le tue pagine wiki?
> - **Opzione A**: in questa directory del repo (più semplice — tutto in un posto)
> - **Opzione B**: in una directory separata (es. `C:/Users/.../mio-wiki`)"

Salva il path assoluto scelto come `<WORKSPACE>`.

**Se sceglie l'Opzione A:** `<WORKSPACE>` = path assoluto della directory corrente (usa `pwd` o `$PWD`).

---

### Step 3 — Configura wiki.config.json

```bash
cp wiki.config.json.example <WORKSPACE>/wiki.config.json
```

Poi modifica `<WORKSPACE>/wiki.config.json` e imposta:
```json
{
  "workspace": "<WORKSPACE>"
}
```

Sostituisci `<WORKSPACE>` con il path assoluto reale. Mantieni tutte le altre chiavi invariate.

---

### Step 4 — Inizializza l'indice vettoriale

Usa l'eseguibile Python trovato al Step 1 (`py`, `python`, o `python3`):
```bash
<PYTHON> scripts/wiki.py rebuild --workspace <WORKSPACE>
```

Output atteso: `{"status": "ok", ...}`. Se fallisce, controlla che lancedb sia installato nel Python usato.

---

### Step 5 — Installa hook e MCP server

Esegui dalla **root del repo clonato**:
```bash
node installer/dist/install.js --workspace <WORKSPACE>
```

L'installer rileva automaticamente il Python corretto e scrive la configurazione in `.claude/settings.json`.

Output atteso:
```
Hook e MCP server installati in: <WORKSPACE>/.claude/settings.json
  Riavvia Claude Code per attivare il wiki context.
```

---

### Step 6 — Comunica all'utente

Di' all'utente:

> "Installazione completata. Riavvia Claude Code per attivare il wiki.
> Dopo il riavvio, ogni tuo prompt riceverà automaticamente le pagine wiki rilevanti nel contesto.
> Per aggiungere conoscenza al wiki, dimmi: 'aggiungi al wiki: [informazione]'."

---

## Uso del wiki (dopo installazione)

Ogni prompt riceve automaticamente un blocco `<wiki-context>` con le pagine più rilevanti. Usalo direttamente — non chiamare `wiki_query` se il contesto è già presente.

| L'utente dice | Tu fai |
|--------------|--------|
| "ricorda che...", "aggiungi al wiki..." | INGEST: scrivi pagine `.tmp` → `wiki.py ingest` |
| "cosa sai su...", "cerca nel wiki..." | QUERY: già in `<wiki-context>`, altrimenti `wiki_query` |
| "fai manutenzione", "controlla il wiki" | LINT: `wiki.py lint --workspace <WORKSPACE> --full` |
| "apri la dashboard" | SERVE: `wiki.py serve --workspace <WORKSPACE>` |

Per i dettagli del protocollo completo: leggi `skills/wiki-core.md` con il tool Read.
