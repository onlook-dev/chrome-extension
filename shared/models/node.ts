export interface Position {
    line: number;
    column: number;
}

export interface TagInfo {
    start: Position
    end: Position
}

// Represents the template code chunk
// Includes all the information to get it from the GitHub repo
export interface TemplateNode {
    path: string,
    startTag: TagInfo,
    endTag: TagInfo,
    commit: string,
}