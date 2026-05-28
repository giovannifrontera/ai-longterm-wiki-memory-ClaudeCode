import { join } from "node:path";
export const wikiLintTool = {
    name: "wiki_lint",
    description: "Esegue manutenzione sul wiki. Con full=true controlla anche link rotti, duplicati semantici e rinominazioni (più lento ma completo).",
    inputSchema: {
        type: "object",
        properties: {
            workspace: { type: "string", description: "Path assoluto al wiki workspace" },
            full: { type: "boolean", description: "Lint completo: link rotti, duplicati semantici, rename detection (default: false)" },
            project: { type: "string", description: "Limita il lint a un progetto wiki-works (opzionale)" },
        },
        required: ["workspace"],
    },
};
export async function handleWikiLint(opts, input, run) {
    const scriptPath = join(opts.scriptsDir, "wiki.py");
    const args = ["lint", "--workspace", input.workspace];
    if (input.full)
        args.push("--full");
    if (input.project)
        args.push("--project", input.project);
    const output = await run(opts, scriptPath, args);
    return {
        content: [{ type: "text", text: output || "Lint completato senza output." }],
    };
}
