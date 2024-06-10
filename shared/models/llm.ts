export interface InvokeResponse {
    tool_calls: {
        name: string;
        args: any;
    }[];
    content: string;
};

export interface InvokeParams {
    content: string;
    element: string;
}
