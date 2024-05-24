export type EditEvent = {
  createdAt: string;
  selector: string;
  editType: EditType;
  newVal: Record<string, string> | Component | TextVal | MoveVal;
  oldVal: Record<string, string> | Component | TextVal | MoveVal;
  path?: string | undefined;
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

export interface Component {
  id?: string; // Exists if Onlook custom component
  parentSelector: string;
  index: number; // Index within parent
  content: string; // String content of the element (For reversibility)
}

export type TextVal = {
  text: string;
}

export type InsertRemoveVal = {
  childContent: string;
  childSelector: string;
  position: string;
}

export type MoveVal = {
  parentSelector: string;
  index: number;
}