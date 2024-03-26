<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { DashboardRoutes } from '$shared/constants';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!auth.currentUser) {
			goto(DashboardRoutes.SIGNIN);
		}
	});
</script>
