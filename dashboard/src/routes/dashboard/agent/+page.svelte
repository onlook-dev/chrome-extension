<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';
	import { InteractionService } from './helper';

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
	let service: InteractionService;

	onMount(() => {
		service = new InteractionService();
		const res = {
			action: 'addEventListener',
			key: 'click',
			value: "(function() { console.log('Clicked!'); })"
		}; // This is the response from the agent
		manipulateElement('#test', res.action, res.key, res.value);
	});

	async function submitInput() {
		if (!value) return;
		logs = [...logs, { author: Author.User, message: value }];

		const res = (await service.prompt(value)) as any;
		manipulateElement('#test', res.action, res.key, res.value);
		logs = [...logs, { author: Author.Agent, message: JSON.stringify(res) }];
		value = '';
	}
	function manipulateElement(selector: string, action: string, key: string, value: string) {
		const element = document.querySelector(selector);
		if (!element) {
			console.error('Element not found');
			return;
		}

		switch (action) {
			case 'function':
				try {
					eval(`element.${key}(${value})`); // Evaluates something like element.focus() or element.setAttribute('src', 'url')
				} catch (error) {
					console.error('Error executing function:', error);
				}
				break;
			case 'style':
				element.style[key] = value;
				break;
			case 'addClass':
				element.classList.add(key);
				break;
			case 'removeClass':
				element.classList.remove(key);
				break;
			case 'setAttribute':
				element.setAttribute(key, value);
				break;
			case 'removeAttribute':
				element.removeAttribute(key);
				break;
			case 'addEventListener':
				try {
					element.addEventListener(key, eval(value)); // value should be a function definition as a string
				} catch (error) {
					console.error('Error adding event listener:', error);
				}
				break;
			case 'removeEventListener':
				try {
					element.removeEventListener(key, eval(value)); // value should be the same function definition used for adding
				} catch (error) {
					console.error('Error removing event listener:', error);
				}
				break;
			case 'toggleVisibility':
				element.style.display = element.style.display === 'none' ? '' : 'none';
				break;
			case 'setInnerHTML':
				element.innerHTML = value;
				break;
			case 'appendInnerHTML':
				element.innerHTML += value;
				break;
			default:
				console.error('Invalid action type');
				break;
		}
	}
</script>

<div class="flex flex-col w-screen h-screen items-center mt-20" style="margin-top: 20px; padding: 20px; height: 100vh; align-items: center; flex-direction: column; width: 100%; justify-content: center; margin: 0px;"></div>
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

	<div class="mt-10 w-96 h-full flex flex-col overflow-auto space-y-2" style="height: 100%; padding: 10px; border-color: #c9c9c9; border-radius: 5px; border-width: 1px;">
		{#each logs as log}
			{#if log.author === Author.User}
				<div class="bg-blue-500 text-white p-2 rounded ml-auto">{log.message}</div>
			{:else}
				<div class="bg-green-500 text-white p-2 rounded mr-auto" style="height: fit-content; width: 50%;">{log.message}</div>
			{/if}
		{/each}
	</div>
</div>
