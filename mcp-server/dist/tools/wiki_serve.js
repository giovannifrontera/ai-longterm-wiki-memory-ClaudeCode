import { join } from "node:path";
export const wikiServeTool = {
    name: "wiki_serve",
    description: "Avvia la dashboard wiki su http://localhost:7331. Tabs: Graf (grafo delle pagine) e Stats.",
    inputSchema: {
        type: "object",
        properties: {
            workspace: { type: "string", description: "Path assoluto al wiki workspace" },
            no_auth: { type: "boolean", description: "Disabilita autenticazione (default: false)" },
        },
        required: ["workspace"],
    },
};
export async function handleWikiServe(opts, input, run) {
    const scriptPath = join(opts.scriptsDir, "wiki.py");
    const args = ["serve", "--workspace", input.workspace];
    if (input.no_auth)
        args.push("--no-auth");
    const output = await run(opts, scriptPath, args);
    return {
        content: [{ type: "text", text: output || "Dashboard avviata su http://localhost:7331" }],
    };
}
