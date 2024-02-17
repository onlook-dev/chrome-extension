export interface EditorStyleChange {
  selector: string;
  styleType: string;
  newVal: Record<string, string>;
  oldVal: Record<string, string>;
  path?: string;
}
