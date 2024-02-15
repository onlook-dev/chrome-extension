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

<CodeBlock
	class="border p-2 rounded overflow-auto"
	language="shell"
	code={`npm i -D @onlook/nextjs`}
></CodeBlock>

<p class="my-4">Add the following code to your <b>next.config.mjs</b> file:</p>

<CodeBlock
	class="border p-2 rounded overflow-auto"
	language="javascript"
	code={`const nextConfig = {
  experimental: {
    swcPlugins: [
		["@onlook/nextjs", {}] // Add onlook preprocessor
	],
  },
};
export default nextConfig;`}
></CodeBlock>
