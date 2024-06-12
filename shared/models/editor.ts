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
  INSERT_CHILD = "INSERT_CHILD",
  REMOVE_CHILD = "REMOVE_CHILD",
  MOVE_CHILD = "MOVE_CHILD",
}

export type TextVal = {
  text: string;
}

export type StructureVal = {
  childSelector: string;
  childPath?: string;
  index: string;

  // If component, keep content since it doesn't exist in code
  componentId?: string;
  content?: string;
}
