import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

export default {
	preprocess: [
		sveltePreprocess({
			postcss: {}
		}),
		vitePreprocess()
	],
	kit: {
		alias: {
			'@/*': './path/to/lib/*'
		}
	}
};
