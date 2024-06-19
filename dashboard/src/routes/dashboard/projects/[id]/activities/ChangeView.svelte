<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
</script>

<Tabs.Root value="preview" class="mt-2 w-full">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
		<Tabs.Trigger value="code">Code</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="preview"><slot name="preview" /></Tabs.Content>
	<Tabs.Content class="w-full h-full" value="code"><slot name="code" /></Tabs.Content>
</Tabs.Root>
