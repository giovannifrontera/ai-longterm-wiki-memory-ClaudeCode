import { join } from "node:path";
import type { BridgeOptions } from "../bridge.js";
import type { RunFn } from "./wiki_query.js";

export interface WikiServeInput {
  workspace: string;
  no_auth?: boolean;
}

export const wikiServeTool = {
  name: "wiki_serve",
  description:
    "Avvia la dashboard wiki su http://localhost:7331. Tabs: Graf (grafo delle pagine) e Stats.",
  inputSchema: {
    type: "object" as const,
    properties: {
      workspace: { type: "string", description: "Path assoluto al wiki workspace" },
      no_auth: { type: "boolean", description: "Disabilita autenticazione (default: false)" },
    },
    required: ["workspace"],
  },
};

export async function handleWikiServe(
  opts: BridgeOptions,
  input: WikiServeInput,
  run: RunFn
) {
  const scriptPath = join(opts.scriptsDir, "wiki.py");
  const args = ["serve", "--workspace", input.workspace];
  if (input.no_auth) args.push("--no-auth");
  const output = await run(opts, scriptPath, args);
  return {
    content: [{ type: "text" as const, text: output || "Dashboard avviata su http://localhost:7331" }],
  };
}
