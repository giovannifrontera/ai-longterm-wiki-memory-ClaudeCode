import type { BridgeOptions } from "../bridge.js";
import type { RunFn } from "./wiki_query.js";
export interface WikiServeInput {
    workspace: string;
    no_auth?: boolean;
}
export declare const wikiServeTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            workspace: {
                type: string;
                description: string;
            };
            no_auth: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleWikiServe(opts: BridgeOptions, input: WikiServeInput, run: RunFn): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
