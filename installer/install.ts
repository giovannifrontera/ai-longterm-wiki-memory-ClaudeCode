import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ── Tipi ─────────────────────────────────────────────────────────────────────
interface HookCommand {
  type: "command";
  command: string;
}

interface HookEntry {
  matcher: string;
  hooks: HookCommand[];
}

interface McpEntry {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

interface ClaudeSettings {
  hooks?: { UserPromptSubmit?: HookEntry[] };
  mcpServers?: Record<string, McpEntry>;
}

// ── Costruttori (esportati per i test) ────────────────────────────────────────
export function buildHookEntry(opts: {
  workspace: string;
  scriptsDir: string;
  python: string;
  k: number;
}): HookEntry {
  const script = join(opts.scriptsDir, "wiki_context.py");
  return {
    matcher: "",
    hooks: [{
      type: "command",
      command: `${opts.python} "${script}" --workspace "${opts.workspace}" --k ${opts.k}`,
    }],
  };
}

export function buildMcpEntry(opts: {
  serverDist: string;
  workspace: string;
  python: string;
}): McpEntry {
  return {
    command: "node",
    args: [opts.serverDist, "--workspace", opts.workspace, "--python", opts.python],
  };
}

// ── Lettura/scrittura settings.json ──────────────────────────────────────────
function readSettings(path: string): ClaudeSettings {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as ClaudeSettings;
  } catch {
    return {};
  }
}

function writeSettings(path: string, settings: ClaudeSettings): void {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, JSON.stringify(settings, null, 2) + "\n", "utf-8");
}

// ── CLI — eseguito solo quando invocato direttamente ──────────────────────────
const isMain = process.argv[1] !== undefined &&
  (process.argv[1].endsWith("install.ts") || process.argv[1].endsWith("install.js"));

if (isMain) {
  const __dirname_main = dirname(fileURLToPath(import.meta.url));

  const argv = process.argv.slice(2);

  function getArg(flag: string, fallback?: string): string {
    const idx = argv.indexOf(flag);
    if (idx !== -1 && argv[idx + 1]) return argv[idx + 1];
    if (fallback !== undefined) return fallback;
    throw new Error(`Flag obbligatoria mancante: ${flag}`);
  }

  const workspace = resolve(getArg("--workspace"));
  const isGlobal = argv.includes("--global");
  const isDryRun = argv.includes("--dry-run");
  const isUninstall = argv.includes("--uninstall");
  const k = parseInt(getArg("--k", "3"), 10);
  const python = getArg("--python", process.platform === "win32" ? "py" : "python3");
  const repoRoot = resolve(__dirname_main, "..", "..");
  const scriptsDir = join(repoRoot, "scripts");
  const serverDist = join(repoRoot, "mcp-server", "dist", "index.js");

  const settingsPath = isGlobal
    ? join(process.env.HOME ?? process.env.USERPROFILE ?? "~", ".claude", "settings.json")
    : join(workspace, ".claude", "settings.json");

  const settings = readSettings(settingsPath);

  if (isUninstall) {
    delete settings.mcpServers?.["wiki-context"];
    if (settings.hooks?.UserPromptSubmit) {
      settings.hooks.UserPromptSubmit = settings.hooks.UserPromptSubmit.filter(
        (h) => !h.hooks.some((c) => c.command.includes("wiki_context.py"))
      );
    }
    if (!isDryRun) writeSettings(settingsPath, settings);
    console.log(`${isDryRun ? "[dry-run] " : ""}Rimosso hook e MCP da ${settingsPath}`);
    process.exit(0);
  }

  // Aggiungi hook
  settings.hooks ??= {};
  settings.hooks.UserPromptSubmit ??= [];
  const existingHookIdx = settings.hooks.UserPromptSubmit.findIndex(
    (h) => h.hooks.some((c) => c.command.includes("wiki_context.py"))
  );
  const hookEntry = buildHookEntry({ workspace, scriptsDir, python, k });
  if (existingHookIdx !== -1) {
    settings.hooks.UserPromptSubmit[existingHookIdx] = hookEntry;
  } else {
    settings.hooks.UserPromptSubmit.push(hookEntry);
  }

  // Aggiungi MCP server
  settings.mcpServers ??= {};
  settings.mcpServers["wiki-context"] = buildMcpEntry({ serverDist, workspace, python });

  if (isDryRun) {
    console.log("[dry-run] Scriverei in:", settingsPath);
    console.log(JSON.stringify(settings, null, 2));
  } else {
    writeSettings(settingsPath, settings);
    console.log("Hook e MCP server installati in:", settingsPath);
    console.log("  Riavvia Claude Code per attivare il wiki context.");
  }
}
