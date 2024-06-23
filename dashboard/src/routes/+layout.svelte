<script lang="ts">
	import { page } from '$app/stores';
	import { subscribeToFirebaseAuthChanges } from '$lib/firebase/auth';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import { MESSAGING_NAMESPACE } from '$shared/message';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import { setNamespace } from 'webext-bridge/window';
	import '../app.css';

	onMount(() => {
		setNamespace(MESSAGING_NAMESPACE);
		subscribeToFirebaseAuthChanges();
		trackMixpanelEvent('Page View', { page: $page.route.id });
	});
</script>

<svelte:head>
	<title>Onlook</title>
</svelte:head>

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
