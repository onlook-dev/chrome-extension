<script lang="ts">
	import { sendToggleVigbug } from '$lib/onlook/messaging'

	function toggleVigbug(event: MouseEvent) {
		sendToggleVigbug()
	}
</script>

<button class="btn btn-outline" on:click={toggleVigbug}>Toggle Visbug</button>
