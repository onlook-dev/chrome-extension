<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { draggable } from "@neodrag/svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Tabs from "$lib/components/ui/tabs";
	import CssEditor from "./CssEditor.svelte";

	let el: Element;
	let visible = false;

	enum TabValue {
		CSS = "css",
		OTHER = "other"
	}

	export function setVisible(value: boolean) {
		visible = value;
	}

	export function setElement(element: Element) {
		el = element;
	}
</script>

<div
	use:draggable={{ bounds: "body" }}
	class="fixed top-10 right-2 transform -translate-y-1/2 -translate-x-1/2 {visible
		? 'visible'
		: 'invisible'}"
>
	<Card.Root class="w-[350px] h-[700px] opacity-[98%] overflow-auto">
		<Card.Header>
			<Card.Title>Editor</Card.Title>
		</Card.Header>
		<Card.Content>
			<Tabs.Root value={TabValue.CSS} class="w-full">
				<Tabs.List>
					<Tabs.Trigger value={TabValue.CSS}>CSS</Tabs.Trigger>
					<Tabs.Trigger value={TabValue.OTHER}>Others</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value={TabValue.CSS}><CssEditor {el} /></Tabs.Content>
				<Tabs.Content value={TabValue.OTHER}>Others</Tabs.Content>
			</Tabs.Root>
		</Card.Content>
		<Card.Footer class="flex justify-between"></Card.Footer>
	</Card.Root>
</div>
