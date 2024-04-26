import { writable, type Writable } from "svelte/store";

export let editorPanelVisible: Writable<boolean> = writable(true);
export let elementsPanelVisible: Writable<boolean> = writable(false);
export let layersPanelCollapsed: Writable<boolean> = writable(false);
export let savingProject: Writable<boolean> = writable(false);