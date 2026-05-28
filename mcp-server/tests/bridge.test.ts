import { describe, it, expect, vi } from "vitest";
import { runScript } from "../src/bridge.js";
import * as cp from "node:child_process";
import * as util from "node:util";

vi.mock("node:child_process");
vi.mock("node:util", async (importOriginal) => {
  const actual = await importOriginal<typeof util>();
  return {
    ...actual,
    promisify: vi.fn(() =>
      vi.fn().mockResolvedValue({ stdout: "output-ok", stderr: "" })
    ),
  };
});

describe("runScript", () => {
  it("chiama execFile con python, scriptPath e args", async () => {
    const result = await runScript(
      { workspace: "/wiki", scriptsDir: "/repo/scripts", python: "py", timeoutMs: 5000 },
      "/wiki/scripts/wiki_context.py",
      ["--workspace", "/wiki", "--q", "test"]
    );
    expect(result).toBe("output-ok");
  });

  it("usa timeout di default 30000ms se non specificato", async () => {
    const result = await runScript(
      { workspace: "/wiki", scriptsDir: "/repo/scripts", python: "py" },
      "/wiki/scripts/wiki.py",
      ["lint"]
    );
    expect(result).toBe("output-ok");
  });
});
