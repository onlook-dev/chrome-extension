<script lang="ts">
	import { onMount } from 'svelte';
	import hljs from 'highlight.js';
	import beautify from 'js-beautify';
	import 'highlight.js/styles/dark.min.css';

	export let code = '';
	export let language = 'html';
	let codeBlock: HTMLElement;

	// Function to format and highlight the code
	function formatAndHighlight() {
		if (!codeBlock) return;
		// Apply beautification
		if (language === 'html') {
			codeBlock.textContent = beautify.html(code, { wrap_attributes: 'force' });
		} else if (language === 'css') {
			codeBlock.textContent = beautify.css(code, {});
		} else if (language === 'javascript') {
			codeBlock.textContent = beautify.js(code, {});
		}
		setTimeout(() => {
			hljs.highlightElement(codeBlock);
		}, 0);
	}

	onMount(formatAndHighlight);
	$: code, formatAndHighlight(); // Re-run formatting and highlighting when code changes
</script>

<div class="max-h-52 overflow-auto">
	<pre>
		<code bind:this={codeBlock} class={language}></code>
	</pre>
</div>
