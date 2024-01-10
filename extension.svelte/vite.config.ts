import { crx } from '@crxjs/vite-plugin'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import manifest from './src/manifest.config'
import hotReloadExtension from 'hot-reload-extension-vite'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		Icons({
			compiler: 'svelte'
		}),
		crx({ manifest }),
		hotReloadExtension({
			log: true,
			backgroundPath: 'src/background.index.ts' // relative path to background script file
		})
	],
	// TODO: This is a hack https://github.com/crxjs/chrome-extension-tools/issues/696
	// https://github.com/crxjs/chrome-extension-tools/issues/746
	server: {
		port: 5173,
		strictPort: true,
		hmr: {
			clientPort: 5173
		}
	},
	resolve: {
		alias: {
			$lib: '/src/lib',
			$utils: '/src/lib/utils',
			$models: '/../models.typescript'
		}
	}
})
