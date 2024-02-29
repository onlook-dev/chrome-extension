import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { onlookPreprocess } from '@onlook/svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess(), onlookPreprocess({ root: process.cwd() })],
	kit: {
		adapter: adapter()
	}
};

export default config;
