export type EditEvent = {
  createdAt: string;
  selector: string;
  editType: EditType;
  newVal: Record<string, string>;
  oldVal: Record<string, string>;
  path?: string | undefined;
}

export enum EditType {
  TEXT,
  STYLE,
  ATTR,
}
