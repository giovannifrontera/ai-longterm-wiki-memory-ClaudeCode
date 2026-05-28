import type { BridgeOptions } from "../bridge.js";
export type RunFn = (opts: BridgeOptions, script: string, args: string[]) => Promise<string>;
export interface WikiQueryInput {
    workspace: string;
    q: string;
    k?: number;
    max_chars?: number;
}
export declare const wikiQueryTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            workspace: {
                type: string;
                description: string;
            };
            q: {
                type: string;
                description: string;
            };
            k: {
                type: string;
                description: string;
            };
            max_chars: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleWikiQuery(opts: BridgeOptions, input: WikiQueryInput, run: RunFn): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
