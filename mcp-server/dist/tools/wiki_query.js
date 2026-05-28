import { join } from "node:path";
export const wikiQueryTool = {
    name: "wiki_query",
    description: "Cerca le pagine wiki più rilevanti per una query. Ritorna un blocco <wiki-context> con i chunk trovati.",
    inputSchema: {
        type: "object",
        properties: {
            workspace: { type: "string", description: "Path assoluto al wiki workspace" },
            q: { type: "string", description: "Query di ricerca" },
            k: { type: "number", description: "Numero di chunk da restituire (default: 3)" },
            max_chars: { type: "number", description: "Caratteri massimi per chunk (default: 600)" },
        },
        required: ["workspace", "q"],
    },
};
export async function handleWikiQuery(opts, input, run) {
    const scriptPath = join(opts.scriptsDir, "wiki_context.py");
    const args = [
        "--workspace", input.workspace,
        "--q", input.q,
        "--k", String(input.k ?? 3),
        "--max-chars", String(input.max_chars ?? 600),
    ];
    const output = await run(opts, scriptPath, args);
    return {
        content: [{ type: "text", text: output || "Nessun risultato trovato." }],
    };
}
