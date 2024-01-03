<script>
	import { goto } from '$app/navigation';
	import { ROUTE_DASHBOARD, ROUTE_SIGNIN } from '$lib/utils/constants';
	import { authUserStore } from '$lib/utils/store';
	import { onMount } from 'svelte';

	onMount(() => {
		if (authUserStore) {
			goto(ROUTE_DASHBOARD);
		} else {
			goto(ROUTE_SIGNIN);
		}
	});
</script>
