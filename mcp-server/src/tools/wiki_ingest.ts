import { join } from "node:path";
import type { BridgeOptions } from "../bridge.js";
import type { RunFn } from "./wiki_query.js";

export interface WikiIngestInput {
  workspace: string;
  pages: string;
  project?: string;
}

export const wikiIngestTool = {
  name: "wiki_ingest",
  description:
    "Aggiunge nuova conoscenza al wiki. Prende un file .tmp con le pagine da scrivere e le indicizza in LanceDB.",
  inputSchema: {
    type: "object" as const,
    properties: {
      workspace: { type: "string", description: "Path assoluto al wiki workspace" },
      pages: { type: "string", description: "Path al file .tmp con le pagine da ingestare" },
      project: { type: "string", description: "Nome del progetto wiki-works (opzionale)" },
    },
    required: ["workspace", "pages"],
  },
};

export async function handleWikiIngest(
  opts: BridgeOptions,
  input: WikiIngestInput,
  run: RunFn
) {
  const scriptPath = join(opts.scriptsDir, "wiki.py");
  const args = ["ingest", "--workspace", input.workspace, "--pages", input.pages];
  if (input.project) args.push("--project", input.project);
  const output = await run(opts, scriptPath, args);
  return {
    content: [{ type: "text" as const, text: output || "Ingest completato." }],
  };
}
