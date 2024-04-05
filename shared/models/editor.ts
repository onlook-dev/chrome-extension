export type EditEvent = {
  createdAt: string;
  selector: string;
  editType: EditType;
  newVal: Record<string, string> | Component | TextVal;
  oldVal: Record<string, string> | Component | TextVal;
  path?: string | undefined;
  componentId?: string | undefined;
}

export type TextVal = {
  text: string;
}

export enum EditType {
  TEXT = "TEXT",
  STYLE = "STYLE",
  CLASS = "CLASS",
  INSERT = "INSERT",
  REMOVE = "REMOVE",
}

export interface Component {
  componentId?: string; // Exists if Onlook custom component
  selector: string;
  parentSelector: string; // Parent selector
  index: number; // Index within parent
  content: string; // String content of the element (For reversibility)
}

export type InsertRemoveVal = {
  childContent: string;
  childSelector: string;
  position: string;
}