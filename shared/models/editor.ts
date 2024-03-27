import type { InsertedComponent } from "./activity";

export type EditEvent = {
  createdAt: string;
  selector: string;
  editType: EditType;
  newVal: Record<string, string> | TextVal | InsertedComponent;
  oldVal: Record<string, string> | TextVal | InsertedComponent;
  path?: string | undefined;
}

export type TextVal = {
  text: string;
}

export enum EditType {
  TEXT = "TEXT",
  STYLE = "STYLE",
  ATTR = "ATTR",
  COMPONENT = "COMPONENT",
  REMOVE = "REMOVE",
}
