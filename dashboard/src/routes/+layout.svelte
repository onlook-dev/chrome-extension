<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { subscribeToFirebaseAuthChanges } from '$lib/firebase/auth';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { page } from '$app/stores';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';

	onMount(() => {
		subscribeToFirebaseAuthChanges();
		trackMixpanelEvent('Page View', { page: $page.route.id });
	});
</script>

<div class="dark">
	<slot />
	<SvelteToast options={{ reversed: true, intro: { y: 192 }, duration: 3000 }} />
</div>

<style>
	:root {
		--toastBackground: #000000;
		--toastColor: #ffffff;
		--toastBarBackground: #ffffff;
		--toastBorderRadius: 5px;
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 2rem;
		--toastContainerLeft: calc(50vw - 8rem);
		--toastBarHeight: 0px;
	}
</style>
