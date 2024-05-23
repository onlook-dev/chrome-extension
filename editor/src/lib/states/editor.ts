import { writable, type Writable } from "svelte/store";

// Panel visible state 
export let editorPanelVisible: Writable<boolean> = writable(false);
export let savePanelVisible: Writable<boolean> = writable(false);
export let elementsPanelVisible: Writable<boolean> = writable(false);
export let layersPanelCollapsed: Writable<boolean> = writable(false);

// Publish state
export let savingProject: Writable<boolean> = writable(false);

// Layers
export let layersHovered: Writable<HTMLElement | undefined> = writable(undefined);
export let layersSelected: Writable<HTMLElement[]> = writable([]);