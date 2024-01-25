<script>
	import { onMount } from 'svelte';
	import { CodeBlock, storeHighlightJs } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import shell from 'highlight.js/lib/languages/shell';
	import 'highlight.js/styles/github.css';

	onMount(() => {
		storeHighlightJs.set(hljs);
		hljs.registerLanguage('javascript', javascript);
		hljs.registerLanguage('shell', shell);
	});
</script>

<CodeBlock class="border p-2 rounded overflow-auto" language="shell" code={`npm i @onlook/svelte`}
></CodeBlock>

<p class="my-4">Add the following code to your <b>svelte.config.js</b> file:</p>

<CodeBlock
	class="border p-2 rounded overflow-auto"
	language="javascript"
	code={`import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { onlookPreprocess } from "@onlook/svelte"; // import onlook preprocessor

const config = {
  preprocess: [
    vitePreprocess(),
    onlookPreprocess(), // Add onlook preprocessor
  ],
  kit: {
    adapter: adapter(),
  },
};

export default config;`}
></CodeBlock>
