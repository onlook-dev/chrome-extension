export interface Position {
    line: number;
    column: number;
}

export interface TagInfo {
    start: Position
    end: Position
}

export interface DomNode {
    path: string,
    startTag: TagInfo,
    endTag: TagInfo,
    commit: string,
}