<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
  import CssEditor from "./CssEditor.svelte";
  import { Separator } from "$lib/components/ui/separator";

  let el: HTMLElement;
  let visible = false;

  enum TabValue {
    CSS = "css",
    OTHER = "other",
  }

  export function setVisible(value: boolean) {
    visible = value;
  }

  export function setElement(element: HTMLElement) {
    el = element;
  }
</script>

<div
  use:draggable={{ bounds: "body" }}
  class="fixed top-10 right-2 transform -translate-y-1/2 -translate-x-1/2 {visible
    ? 'visible'
    : 'visible'}"
>
  <Card.Root class="w-[232px] h-[80vh] opacity-[98%] overflow-auto pt-2">
    <Card.Content>
      <Tabs.Root value={TabValue.CSS} class="w-full">
        <Tabs.List class="bg-transparent p-0 gap-4">
          <Tabs.Trigger class="bg-transparent p-0 text-xs" value={TabValue.CSS}
            >Element Appearance</Tabs.Trigger
          >
        </Tabs.List>
        <Separator class="mt-1" />
        <Tabs.Content value={TabValue.CSS}><CssEditor {el} /></Tabs.Content>
        <Tabs.Content value={TabValue.OTHER}>Others</Tabs.Content>
        <Card.Footer class="flex justify-between"></Card.Footer>
      </Tabs.Root>
    </Card.Content>
  </Card.Root>
</div>
