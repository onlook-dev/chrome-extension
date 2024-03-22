

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/privacy/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.uZh7rkyR.js","_app/immutable/chunks/scheduler.2JpnNXgI.js","_app/immutable/chunks/index.miTbgV9r.js"];
export const stylesheets = [];
export const fonts = [];
