import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],
	kit: {
		alias: {
			$lib: '/src/lib',
			$utils: '/src/lib/utils',
			$models: '/../models'
		},
		adapter: adapter()
	}
};

export default config;
