<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { subscribeToFirebaseAuthChanges } from '$lib/firebase/auth';

	onMount(() => {
		subscribeToFirebaseAuthChanges();
	});
</script>

<slot />
