export type EditEvent = {
  createdAt: string;
  selector: string;
  editType: EditType;
  newVal: Record<string, string> | TextVal | StructureVal;
  oldVal: Record<string, string> | TextVal | StructureVal;
  path?: string | undefined;
  snapshot?: string | undefined;
  componentId?: string | undefined;
}

export enum EditType {
  TEXT = "TEXT",
  STYLE = "STYLE",
  CLASS = "CLASS",
  INSERT = "INSERT",
  REMOVE = "REMOVE",
  MOVE = "MOVE",
}

export type TextVal = {
  text: string;
}

export type StructureVal = {
  parentSelector: string;
  parentPath?: string;
  index: string;

  // If component, keep content since it doesn't exist in code
  componentId?: string;
  content?: string;
}
