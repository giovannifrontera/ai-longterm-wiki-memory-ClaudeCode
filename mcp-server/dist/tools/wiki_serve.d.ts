import type { BridgeOptions } from "../bridge.js";
export interface WikiServeInput {
    workspace: string;
    no_auth?: boolean;
    port?: number;
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
            port: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleWikiServe(opts: BridgeOptions, input: WikiServeInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
