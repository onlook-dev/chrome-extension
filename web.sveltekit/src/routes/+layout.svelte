<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { subscribeToFirebaseAuthChanges } from '$lib/firebase/auth';
	import { setupFirebase } from '$lib/firebase/firebase';
	import { userStore } from '$lib/utils/store';
	import { goto } from '$app/navigation';
	import { ROUTE_SIGNIN } from '$lib/utils/constants';

	onMount(() => {
		setupFirebase();
		subscribeToFirebaseAuthChanges();
		// If no user, something happened with signing in
		userStore.subscribe((user) => {
			if (!user) goto(ROUTE_SIGNIN);
		});
	});
</script>

<slot />
