import dotenv from 'dotenv';
dotenv.config();

import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.min.js'
	},
	plugins: [
		replace({
			preventAssignment: true,
			'process.env.NODE_ENV': JSON.stringify('production'),
			'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
			'process.env.NGROK_SERVER_URL': JSON.stringify(process.env.NGROK_SERVER_URL),
		}),
		svelte({
			preprocess: sveltePreprocess({ sourceMap: false, postcss: true, typescript: true }),
			compilerOptions: {
				dev: !production
			}
		}),
		typescript({
			sourceMap: false,
			inlineSources: !production
		}),
		postcss({
			plugins: []
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
		commonjs(),
		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false,
		exclude: ['node_modules/**']
	}
};
