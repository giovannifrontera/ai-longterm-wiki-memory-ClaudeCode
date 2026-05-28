import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface BridgeOptions {
  workspace: string;
  scriptsDir: string;
  python: string;
  timeoutMs?: number;
}

export async function runScript(
  opts: BridgeOptions,
  scriptPath: string,
  args: string[]
): Promise<string> {
  const { stdout } = await execFileAsync(
    opts.python,
    [scriptPath, ...args],
    { encoding: "utf-8", timeout: opts.timeoutMs ?? 30_000 }
  );
  return stdout;
}
