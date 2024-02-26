export type EditEvent = {
  type: string;
  detail: {
    createdAt: string;
    selector: string;
    styleType: string;
    newVal: Record<string, string>;
    oldVal: Record<string, string>;
    path?: string | undefined;
  }
}