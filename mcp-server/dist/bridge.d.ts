export interface BridgeOptions {
    workspace: string;
    scriptsDir: string;
    python: string;
    timeoutMs?: number;
}
export declare function runScript(opts: BridgeOptions, scriptPath: string, args: string[]): Promise<string>;
