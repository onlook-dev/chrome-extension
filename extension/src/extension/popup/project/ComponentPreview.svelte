<style>
	.non-interactive {
		pointer-events: none;
		user-select: none;
	}
</style>

<script lang="ts">
	export let component: string
</script>

<div class="flex items-center justify-center non-interactive">
	{@html component}
</div>
