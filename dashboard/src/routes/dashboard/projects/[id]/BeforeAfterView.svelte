<script lang="ts">
	export let beforeImage: string | undefined;
	export let afterImage: string | undefined;
</script>

{#if beforeImage && afterImage}
	<div class="diff w-full h-full max-w-[80%] max-h-[80%]">
		<div class="diff-item-1">
			<img class="object-scale-down" src={afterImage} alt="Before screenshot" />
		</div>
		<div class="diff-item-2">
			<img class="object-scale-down" src={beforeImage} alt="After screenshot" />
		</div>
		<div class="diff-resizer"></div>
	</div>
{:else if beforeImage}
	<div class=" w-full h-full max-w-[80%] max-h-[80%]">
		<img class="object-scale-down" src={beforeImage} alt="After screenshot" />
	</div>
{:else if afterImage}
	<div class=" w-full h-full max-w-[80%] max-h-[80%]">
		<img class="object-scale-down" src={afterImage} alt="After screenshot" />
	</div>
{:else}
	<img class="skeleton" alt="Empty state" />
{/if}
