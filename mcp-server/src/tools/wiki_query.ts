import { join } from "node:path";
import type { BridgeOptions } from "../bridge.js";

export type RunFn = (
  opts: BridgeOptions,
  script: string,
  args: string[]
) => Promise<string>;

export interface WikiQueryInput {
  workspace: string;
  q: string;
  k?: number;
  max_chars?: number;
}

export const wikiQueryTool = {
  name: "wiki_query",
  description:
    "Cerca le pagine wiki più rilevanti per una query. Ritorna un blocco <wiki-context> con i chunk trovati.",
  inputSchema: {
    type: "object" as const,
    properties: {
      workspace: { type: "string", description: "Path assoluto al wiki workspace" },
      q: { type: "string", description: "Query di ricerca" },
      k: { type: "number", description: "Numero di chunk da restituire (default: 3)" },
      max_chars: { type: "number", description: "Caratteri massimi per chunk (default: 600)" },
    },
    required: ["workspace", "q"],
  },
};

export async function handleWikiQuery(
  opts: BridgeOptions,
  input: WikiQueryInput,
  run: RunFn
) {
  const scriptPath = join(opts.scriptsDir, "wiki_context.py");
  const args = [
    "--workspace", input.workspace,
    "--q", input.q,
    "--k", String(input.k ?? 3),
    "--max-chars", String(input.max_chars ?? 600),
  ];
  const output = await run(opts, scriptPath, args);
  return {
    content: [{ type: "text" as const, text: output || "Nessun risultato trovato." }],
  };
}
