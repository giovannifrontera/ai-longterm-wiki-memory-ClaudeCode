import { join } from "node:path";
import { spawn } from "node:child_process";
export const wikiServeTool = {
    name: "wiki_serve",
    description: "Avvia la dashboard wiki su http://localhost:7331 (o porta specificata). Tabs: Graf e Stats. Il processo gira in background.",
    inputSchema: {
        type: "object",
        properties: {
            workspace: { type: "string", description: "Path assoluto al wiki workspace" },
            no_auth: { type: "boolean", description: "Disabilita autenticazione (default: false)" },
            port: { type: "number", description: "Porta HTTP (default: 7331)" },
        },
        required: ["workspace"],
    },
};
export async function handleWikiServe(opts, input) {
    const scriptPath = join(opts.scriptsDir, "wiki.py");
    const port = input.port ?? 7331;
    const args = ["serve", "--workspace", input.workspace, "--port", String(port)];
    if (input.no_auth)
        args.push("--no-auth");
    // wiki.py serve chiama uvicorn.run() che è bloccante — non può essere gestito
    // con execFile. Lo avviamo in background con spawn+detach e ritorniamo subito.
    const child = spawn(opts.python, [scriptPath, ...args], {
        detached: true,
        stdio: "ignore",
    });
    child.unref();
    return {
        content: [{
                type: "text",
                text: `Dashboard avviata in background su http://localhost:${port}\nPID: ${child.pid ?? "unknown"}`,
            }],
    };
}
