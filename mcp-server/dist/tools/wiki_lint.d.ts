import type { BridgeOptions } from "../bridge.js";
import type { RunFn } from "./wiki_query.js";
export interface WikiLintInput {
    workspace: string;
    project?: string;
}
export declare const wikiLintTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            workspace: {
                type: string;
                description: string;
            };
            project: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleWikiLint(opts: BridgeOptions, input: WikiLintInput, run: RunFn): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
