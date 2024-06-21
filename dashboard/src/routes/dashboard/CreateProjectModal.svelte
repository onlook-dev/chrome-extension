<script lang="ts">
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import { MessageService, MessageType } from '$shared/message';
	import { ArrowRight, Plus } from 'svelte-radix';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { ExternalLinks } from '$shared/constants';

	export let modalOpen = false;
	let inputUrl = '';
	let errorText = '';

	function createButtonClicked() {
		if (!inputUrl) {
			errorText = 'Please enter a URL';
			return;
		}

		// Check if the URL starts with http:// or https://
		if (!inputUrl.match(/^https?:\/\//)) {
			// Assume it might be a valid URL if it has a domain-like structure following by optional paths
			if (inputUrl.match(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
				inputUrl = 'https://' + inputUrl; // Prepend https:// if it seems like a valid URL
			} else {
				errorText = 'Please enter a valid URL';
				return;
			}
		}
		errorText = '';
		console.log('Creating project from URL:', inputUrl);
		openUrl(inputUrl);
	}

	function openUrl(url: string) {
		MessageService.getInstance().publish(MessageType.OPEN_URL, { url, inject: true });
		url = '';
		modalOpen = false;
		trackMixpanelEvent('Create Project from dashboard', { url });
	}
</script>

<Dialog.Root bind:open={modalOpen}>
	<Dialog.Trigger>
		<Button><Plus class="h-4 w-4 mr-2" />Create Project</Button>
	</Dialog.Trigger>
	<Dialog.Content class="dark">
		<Dialog.Header>
			<Dialog.Title>Create a New Project</Dialog.Title>
		</Dialog.Header>
		<Dialog.Description>
			<p>
				<span>Add your URL to create a new project, or try a </span>
				<Button
					class="m-0 p-0 ml-1 underline text-green-500"
					variant="link"
					on:click={() => openUrl(ExternalLinks.DEMO_LINK_PORTFOLIO)}
					>Demo project <ArrowRight class="h-4 w-4 ml-1" /></Button
				>
			</p>
		</Dialog.Description>

		<form class="flex flex-col space-y-4 mt-2">
			<Input
				bind:value={inputUrl}
				on:input={() => (errorText = '')}
				type="text"
				placeholder="https://onlook.dev"
				class={errorText ? 'border-red-500' : ''}
			/>

			<p class="text-red-500 text-sm">{errorText}</p>
			<div class="w-full flex">
				<Button class="ml-auto" type="submit" on:click={createButtonClicked}>Start designing</Button
				>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
