import { DATA_ONLOOK_ID } from "../constants";

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
  SOURCE_MAP_ID = DATA_ONLOOK_ID,
}

export let getEventDataByType = (
  eventDataList: EventMetadata[],
  type: EventMetadataType
) => {
  return eventDataList.find((data) => data.type === type)?.value;
};
