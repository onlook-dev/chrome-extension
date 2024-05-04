<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';

	enum Author {
		User = 'User',
		Agent = 'Agent'
	}

	interface Chats {
		author: Author;
		message: string;
	}

	let value = '';
	let logs: Chats[] = [];

	onMount(() => {
		const test = document.getElementById('test') as HTMLDivElement;

		test.addEventListener('click', () => {
			test.style.backgroundColor = 'red';
		});
	});

	function submitInput() {
		if (!value) return;
		logs = [
			...logs,
			{ author: Author.User, message: value },
			{ author: Author.Agent, message: value }
		];
		value = '';
	}
</script>

<div class="flex flex-col w-screen h-screen items-center mt-20">
	<form class="flex flex-row space-x-2 w-96">
		<Input
			on:keypress={(e) => {
				// Enter or meta + enter
				if (e.key === 'Enter' || (e.metaKey && e.key === 'Enter')) {
					submitInput();
				}
			}}
			bind:value
			placeholder="Interact with div"
			class="w-full rounded"
		/>
		<Button on:click={submitInput} class="bg-black text-white">Submit</Button>
	</form>

	<div class="mt-10 w-96 h-96 border shadow bg-stone-100 items-center justify-center flex">
		<div id="test" class="w-10 h-10 bg-stone-500"></div>
	</div>

	<div class="mt-10 w-96 h-full flex flex-col overflow-auto">
		{#each logs as log}
			{#if log.author === Author.User}
				<div class="bg-blue-500 text-white p-2 rounded ml-auto">{log.message}</div>
			{:else}
				<div class="bg-green-500 text-white p-2 rounded mr-auto">{log.message}</div>
			{/if}
		{/each}
	</div>
</div>
