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

<div class="flex flex-col w-screen h-screen items-center justify-center p-5 m-0">
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
			class="w-full rounded text-black"
		/>
		<Button on:click={submitInput} class="bg-black text-white">Submit</Button>
	</form>

	<div class="mt-10 w-96 h-96 border shadow bg-stone-100 items-center justify-center flex">
		<div
			id="test"
			class="w-10 h-10 bg-stone-500 border"
			on:click={(e) => {
				const testEl = e.currentTarget;
				if (!testEl) return;
				// Inset copy in parent
				const copy = testEl.cloneNode(true);
				testEl.parentElement?.appendChild(copy);
			}}
		></div>
	</div>

	<div
		class="mt-10 w-96 h-full flex flex-col overflow-auto space-y-2 p-2.5 rounded border border-gray-300"
	>
		<!-- <p class="bg-green-500 mr-auto w-[50%] h-fit text-ellipsis text-white p-2 rounded">
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
			been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
			galley of type and scrambled it to make a type specimen book. It has survived not only five
			centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
			was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
			passages, and more recently with desktop publishing software like Aldus PageMaker including
			versions of Lorem Ipsum.
		</p>
		<p class="bg-blue-500 ml-auto w-[50%] h-fit text-ellipsis text-white p-2 rounded">
			Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
			been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
			galley of type and scrambled it to make a type specimen book. It has survived not only five
			centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
			was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
			passages, and more recently with desktop publishing software like Aldus PageMaker including
			versions of Lorem Ipsum.
		</p> -->
		{#each logs as log}
			<p
				class="{log.author === Author.User
					? 'bg-blue-500 ml-auto'
					: 'bg-green-500 mr-auto'} w-[50%] h-fit text-ellipsis text-white p-2 rounded"
			>
				{log.message}
			</p>
		{/each}
	</div>
</div>
