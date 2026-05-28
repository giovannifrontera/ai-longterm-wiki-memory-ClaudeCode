import { describe, it, expect } from "vitest";
import { buildHookEntry, buildMcpEntry, detectPython } from "../install.js";

describe("buildHookEntry", () => {
  it("produce un hook UserPromptSubmit valido", () => {
    const entry = buildHookEntry({
      workspace: "C:/Users/giova/ai-wiki-system",
      scriptsDir: "C:/Users/giova/ai-longterm-wiki-memory-ClaudeCode/scripts",
      python: "py",
      k: 3,
    });
    expect(entry.matcher).toBe("");
    expect(entry.hooks[0].type).toBe("command");
    expect(entry.hooks[0].command).toContain("wiki_context.py");
    expect(entry.hooks[0].command).toContain("--workspace");
  });
});

describe("detectPython", () => {
  it("ritorna una stringa non vuota", () => {
    const py = detectPython();
    expect(typeof py).toBe("string");
    expect(py.length).toBeGreaterThan(0);
  });
});

describe("buildMcpEntry", () => {
  it("produce una voce mcpServers valida", () => {
    const entry = buildMcpEntry({
      serverDist: "C:/Users/giova/ai-longterm-wiki-memory-ClaudeCode/mcp-server/dist/index.js",
      workspace: "C:/Users/giova/ai-wiki-system",
      python: "py",
    });
    expect(entry.command).toBe("node");
    expect(entry.args).toContain("--workspace");
    expect(entry.args).toContain("C:/Users/giova/ai-wiki-system");
  });
});
