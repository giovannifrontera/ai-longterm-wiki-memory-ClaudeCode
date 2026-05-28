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
