import { join } from "node:path";
export const wikiIngestTool = {
    name: "wiki_ingest",
    description: "Aggiunge nuova conoscenza al wiki. Prende un file .tmp con le pagine da scrivere e le indicizza in LanceDB.",
    inputSchema: {
        type: "object",
        properties: {
            workspace: { type: "string", description: "Path assoluto al wiki workspace" },
            pages: { type: "string", description: "Path al file .tmp con le pagine da ingestare" },
            log: { type: "string", description: "Etichetta per il log dell'operazione (default: 'ingest | via-mcp')" },
            project: { type: "string", description: "Nome del progetto wiki-works (opzionale)" },
        },
        required: ["workspace", "pages"],
    },
};
export async function handleWikiIngest(opts, input, run) {
    const scriptPath = join(opts.scriptsDir, "wiki.py");
    const args = [
        "ingest",
        "--workspace", input.workspace,
        "--pages", input.pages,
        "--log", input.log ?? "ingest | via-mcp",
    ];
    if (input.project)
        args.push("--project", input.project);
    const output = await run(opts, scriptPath, args);
    return {
        content: [{ type: "text", text: output || "Ingest completato." }],
    };
}
