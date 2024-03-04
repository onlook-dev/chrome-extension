export type EditEvent = {
  createdAt: string;
  selector: string;
  editType: EditType;
  newVal: Record<string, string> | InsertRemoveVal | TextVal;
  oldVal: Record<string, string> | InsertRemoveVal | TextVal;
  path?: string | undefined;
}

export type TextVal = {
  text: string;
}

export type InsertRemoveVal = {
  childContent: string;
  childSelector: string;
  position: number;
}

export enum EditType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  STYLE = "STYLE",
  ATTR = "ATTR",
  INSERT = "INSERT",
  REMOVE = "REMOVE",
}
