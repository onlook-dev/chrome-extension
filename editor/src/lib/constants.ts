import { EditorAttributes } from "$shared/constants";

export const DATA_ONLOOK_IGNORE = "data-onlook-ignore";
export const DATA_ONLOOK_SELECTOR = "data-onlook-selector";
export const DATA_ONLOOK_INJECT = "data-onlook-inject";
export const DATA_ONLOOK_EJECT = "data-onlook-eject";
export const DATA_ONLOOK_SAVED = "data-onlook-saved";
export const DATA_ONLOOK_COMPONENT_ID = "data-onlook-component-id";

export const ONLOOK_RECT_ID = "onlook-rect";
export const ONLOOK_EDITABLE = "onlook-editable";
export const ONLOOK_RECT_ELEMENT = "rect-popover";
export const IGNORE_TAGS = ["SCRIPT", "STYLE", EditorAttributes.ONLOOK_TOOLBAR.toUpperCase()];
