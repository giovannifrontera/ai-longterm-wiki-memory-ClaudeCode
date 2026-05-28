import { describe, it, expect } from "vitest";
import { wikiQueryTool, handleWikiQuery } from "../src/tools/wiki_query.js";

describe("wikiQueryTool definition", () => {
  it("ha name corretto", () => {
    expect(wikiQueryTool.name).toBe("wiki_query");
  });

  it("ha inputSchema con workspace e q obbligatori", () => {
    const required = wikiQueryTool.inputSchema.required as string[];
    expect(required).toContain("workspace");
    expect(required).toContain("q");
  });
});

describe("handleWikiQuery", () => {
  it("ritorna oggetto con content array", async () => {
    const fakeRun = async () => "<wiki-context>\ntest\n</wiki-context>";
    const result = await handleWikiQuery(
      { workspace: "/wiki", scriptsDir: "/repo/scripts", python: "py" },
      { workspace: "/wiki", q: "test query", k: 3 },
      fakeRun
    );
    expect(result.content).toBeDefined();
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("wiki-context");
  });
});

import { wikiIngestTool, handleWikiIngest } from "../src/tools/wiki_ingest.js";

describe("wikiIngestTool definition", () => {
  it("ha name corretto", () => {
    expect(wikiIngestTool.name).toBe("wiki_ingest");
  });
  it("ha inputSchema con workspace e pages obbligatori", () => {
    const required = wikiIngestTool.inputSchema.required as string[];
    expect(required).toContain("workspace");
    expect(required).toContain("pages");
  });
});

describe("handleWikiIngest", () => {
  it("ritorna content con output dello script", async () => {
    const fakeRun = async () => '{"status":"ok","pages_written":1}';
    const result = await handleWikiIngest(
      { workspace: "/wiki", scriptsDir: "/repo/scripts", python: "py" },
      { workspace: "/wiki", pages: "page.tmp" },
      fakeRun
    );
    expect(result.content[0].text).toContain("ok");
  });
});

import { wikiLintTool, handleWikiLint } from "../src/tools/wiki_lint.js";

describe("wikiLintTool definition", () => {
  it("ha name corretto", () => expect(wikiLintTool.name).toBe("wiki_lint"));
  it("richiede solo workspace", () => {
    const required = wikiLintTool.inputSchema.required as string[];
    expect(required).toContain("workspace");
  });
});

describe("handleWikiLint", () => {
  it("ritorna output lint", async () => {
    const fakeRun = async () => "LINT OK: 0 issues";
    const result = await handleWikiLint(
      { workspace: "/wiki", scriptsDir: "/repo/scripts", python: "py" },
      { workspace: "/wiki" },
      fakeRun
    );
    expect(result.content[0].text).toBe("LINT OK: 0 issues");
  });
});

import { wikiServeTool, handleWikiServe } from "../src/tools/wiki_serve.js";

describe("wikiServeTool definition", () => {
  it("ha name corretto", () => expect(wikiServeTool.name).toBe("wiki_serve"));
  it("richiede workspace", () => {
    expect((wikiServeTool.inputSchema.required as string[])).toContain("workspace");
  });
});

describe("handleWikiServe", () => {
  it("ritorna istruzione di avvio", async () => {
    const fakeRun = async () => "Dashboard available at http://localhost:7331";
    const result = await handleWikiServe(
      { workspace: "/wiki", scriptsDir: "/repo/scripts", python: "py" },
      { workspace: "/wiki" },
      fakeRun
    );
    expect(result.content[0].text).toContain("7331");
  });
});
