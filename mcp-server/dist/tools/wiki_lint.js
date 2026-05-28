import { join } from "node:path";
export const wikiLintTool = {
    name: "wiki_lint",
    description: "Esegue manutenzione sul wiki: trova e risolve vettori stale, pagine non indicizzate, link rotti, duplicati.",
    inputSchema: {
        type: "object",
        properties: {
            workspace: { type: "string", description: "Path assoluto al wiki workspace" },
            project: { type: "string", description: "Limita il lint a un progetto wiki-works (opzionale)" },
        },
        required: ["workspace"],
    },
};
export async function handleWikiLint(opts, input, run) {
    const scriptPath = join(opts.scriptsDir, "wiki.py");
    const args = ["lint", "--workspace", input.workspace];
    if (input.project)
        args.push("--project", input.project);
    const output = await run(opts, scriptPath, args);
    return {
        content: [{ type: "text", text: output || "Lint completato senza output." }],
    };
}
