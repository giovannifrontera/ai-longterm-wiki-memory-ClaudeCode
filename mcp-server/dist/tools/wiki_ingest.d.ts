import type { BridgeOptions } from "../bridge.js";
import type { RunFn } from "./wiki_query.js";
export interface WikiIngestInput {
    workspace: string;
    pages: string;
    project?: string;
}
export declare const wikiIngestTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            workspace: {
                type: string;
                description: string;
            };
            pages: {
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
export declare function handleWikiIngest(opts: BridgeOptions, input: WikiIngestInput, run: RunFn): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
