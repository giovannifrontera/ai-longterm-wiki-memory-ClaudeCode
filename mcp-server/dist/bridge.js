import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
export async function runScript(opts, scriptPath, args) {
    const { stdout } = await execFileAsync(opts.python, [scriptPath, ...args], { encoding: "utf-8", timeout: opts.timeoutMs ?? 30_000 });
    return stdout;
}
