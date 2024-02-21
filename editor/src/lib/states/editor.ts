import { writable, type Writable } from "svelte/store";

export let editorPanelVisible: Writable<boolean> = writable(false);
export let layersPanelVisible: Writable<boolean> = writable(false);