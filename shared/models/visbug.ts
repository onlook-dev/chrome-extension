export interface VisbugStyleChange {
  selector: string;
  styleType: string;
  newVal: Record<string, string>;
  oldVal: Record<string, string>;
}
