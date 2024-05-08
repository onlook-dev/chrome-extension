<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { MessageService, MessageType } from '$shared/message';
	import { Plus } from 'svelte-radix';
	let modalOpen = true;
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
				<span>Add your URL to create a new project. </span>
				<span>You can also click the Onlook icon on the page to quick start.</span>
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
					}}>Create and Edit</Button
				>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
