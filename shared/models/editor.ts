export type EditEvent = {
  createdAt: string;
  selector: string;
  editType: EditType;
  newVal: Record<string, string> | TextVal | ChildVal;
  oldVal: Record<string, string> | TextVal | ChildVal;
  path?: string;
  snapshot?: string;
  componentId?: string;
  source?: EditSource;
}

export enum EditSource {
  MANUAL = "MANUAL",
  PROMPT = "PROMPT",
}

export enum EditType {
  TEXT = "TEXT",
  STYLE = "STYLE",
  CLASS = "CLASS",
  INSERT_CHILD = "INSERT_CHILD",
  REMOVE_CHILD = "REMOVE_CHILD",
  MOVE_CHILD = "MOVE_CHILD",
}

export type TextVal = {
  text: string;
}

export type ChildVal = {
  selector: string;
  index: string;
  componentId?: string;
  content?: string;
  path?: string;
}