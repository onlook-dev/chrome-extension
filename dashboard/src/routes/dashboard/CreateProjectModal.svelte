<script lang="ts">
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import { MessageService, MessageType } from '$shared/message';
	import { Plus } from 'svelte-radix';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	let modalOpen = false;
	let url = '';
</script>

<Dialog.Root bind:open={modalOpen}>
	<Dialog.Trigger>
		<Button><Plus class="h-4 w-4 mr-2" />Create Project</Button>
	</Dialog.Trigger>
	<Dialog.Content class="dark">
		<Dialog.Header>
			<Dialog.Title>Create New Project</Dialog.Title>
		</Dialog.Header>
		<Dialog.Description>
			<p>
				<span>Add your URL to create a new project or try a </span>
				<span class="text-[#00DEBA]">Demo Project</span>
			</p>
		</Dialog.Description>

		<form class="flex flex-col space-y-4 mt-2">
			<Input
				bind:value={url}
				type="url"
				name="url"
				id="url"
				placeholder="https://onlook.dev"
				pattern="https://.*"
				required
			/>

			<div class="w-full flex">
				<Button
					class="ml-auto"
					type="submit"
					on:click={() => {
						MessageService.getInstance().publish(MessageType.OPEN_URL, { url, inject: true });
						url = '';
						modalOpen = false;
						trackMixpanelEvent('Create Project from dashboard', { url });
					}}>Create and Edit</Button
				>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
