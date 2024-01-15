import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	resolve: {
		alias: {
			$shared: path.resolve(__dirname, '../shared') // Go up one level and then into shared
		}
	}
});
