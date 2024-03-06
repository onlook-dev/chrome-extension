<style>
	.non-interactive {
		pointer-events: none;
		user-select: none;
	}

	iframe {
		width: 100%; /* Adjust as needed */
		height: 100%; /* Adjust as needed */
		border: none; /* Removes default iframe border */
	}
</style>

<script lang="ts">
	export let component: string
</script>

<div class="flex items-center justify-center non-interactive">
	<iframe title="inserted component" srcdoc={component}></iframe>
</div>
