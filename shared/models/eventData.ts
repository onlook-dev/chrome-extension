export interface EventMetadata {
  key: string;
  value: string;
  type: EventMetadataType;
}

export enum EventMetadataType {
  SCREEN_SIZE = "screen-size",
  BROWSER = "browser",
  OS = "os",
  TIME_STAMP = "time-stamp",
}
