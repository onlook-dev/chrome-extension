<script>
	import ArrowLeft from '~icons/formkit/arrowleft'
	import { PopupRoutes } from '$lib/utils/constants'
	import { popupStateBucket, projectsMapBucket } from '$lib/utils/localstorage'

	function returnToDashboard() {
		popupStateBucket.set({ activeRoute: PopupRoutes.DASHBOARD })
	}
</script>

<div class="navbar p-none">
	<div class="flex-none">
		<button on:click={returnToDashboard} class="btn btn-sm btn-ghost">
			<ArrowLeft /> Dashboard</button
		>
	</div>
</div>
