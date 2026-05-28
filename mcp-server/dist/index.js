import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runScript } from "./bridge.js";
import { wikiQueryTool, handleWikiQuery } from "./tools/wiki_query.js";
import { wikiIngestTool, handleWikiIngest } from "./tools/wiki_ingest.js";
import { wikiLintTool, handleWikiLint } from "./tools/wiki_lint.js";
import { wikiServeTool, handleWikiServe } from "./tools/wiki_serve.js";
// __dirname per ESM: dist/index.js → ../../scripts = scripts/ del repo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scriptsDir = resolve(__dirname, "../../scripts");
// Parse --workspace e --python da argv
const args = process.argv.slice(2);
const workspaceIdx = args.indexOf("--workspace");
const pythonIdx = args.indexOf("--python");
if (workspaceIdx === -1 || !args[workspaceIdx + 1]) {
    console.error("Usage: node index.js --workspace <path> [--python <py>]");
    process.exit(1);
}
const opts = {
    workspace: args[workspaceIdx + 1],
    scriptsDir,
    python: pythonIdx !== -1 ? args[pythonIdx + 1] : (process.platform === "win32" ? "py" : "python3"),
};
const server = new Server({ name: "wiki-context", version: "0.1.0" }, { capabilities: { tools: {} } });
const tools = [wikiQueryTool, wikiIngestTool, wikiLintTool, wikiServeTool];
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: input } = request.params;
    const i = (input ?? {});
    try {
        switch (name) {
            case "wiki_query":
                return await handleWikiQuery(opts, { workspace: String(i.workspace ?? opts.workspace), q: String(i.q ?? ""), k: Number(i.k ?? 3) }, runScript);
            case "wiki_ingest":
                return await handleWikiIngest(opts, { workspace: String(i.workspace ?? opts.workspace), pages: String(i.pages ?? ""), project: i.project }, runScript);
            case "wiki_lint":
                return await handleWikiLint(opts, { workspace: String(i.workspace ?? opts.workspace), project: i.project }, runScript);
            case "wiki_serve":
                return await handleWikiServe(opts, { workspace: String(i.workspace ?? opts.workspace), no_auth: Boolean(i.no_auth), port: i.port });
            default:
                return { content: [{ type: "text", text: `Tool sconosciuto: ${name}` }], isError: true };
        }
    }
    catch (err) {
        return { content: [{ type: "text", text: `Errore: ${String(err)}` }], isError: true };
    }
});
const transport = new StdioServerTransport();
await server.connect(transport);
