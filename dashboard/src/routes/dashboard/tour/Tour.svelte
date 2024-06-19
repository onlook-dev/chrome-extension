<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { DrawingPinFilled } from 'svelte-radix';
	import Pin from '$lib/assets/welcome-pin.gif';

	export let createProjectModelOpen = false;
	let tourVisible = true;
</script>

<div
	class="{tourVisible ? 'visible' : 'invisible'} 
        fixed inset-0 z-50 bg-black/90 flex flex-col justify-center items-center"
>
	<div class="text-primary space-y-8 text-center">
		<h1 class="text-xl">Pin the extension</h1>
		<img class="h-auto max-w-md rounded-lg" src={Pin} alt="Pin extension tip" />
		<Button
			variant="primary"
			on:click={() => {
				tourVisible = false;
				createProjectModelOpen = true;
			}}
			><DrawingPinFilled class="h-4 w-4 mr-2" /> I pinned the extension and am ready to design</Button
		>
	</div>
</div>
