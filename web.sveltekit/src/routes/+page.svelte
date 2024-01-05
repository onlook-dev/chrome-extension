<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/firebase';
	import { ROUTE_SIGNIN } from '$lib/utils/constants';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!auth.currentUser) {
			goto(ROUTE_SIGNIN);
		}
	});
</script>
