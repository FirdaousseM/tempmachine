import * as server from '../entries/pages/_page.server.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/2.BG3uSvN5.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.SXUR_2us.js"];
export const stylesheets = [];
export const fonts = [];
