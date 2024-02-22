<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea";

  export let editTool;
  let elementToClass: WeakMap<HTMLElement, { original: string; edit: string }> =
    new WeakMap();

  function applyClass(element: HTMLElement, newClass: string) {
    console.log("applyClass", element, newClass);
    let stored = elementToClass.get(element);
    if (!stored) {
      // Save the original class if not previously saved
      stored = { original: element.className, edit: newClass };
      elementToClass.set(element, stored);
    } else {
      // Update the edit class
      stored.edit = newClass;
    }
    // Apply original + new classes
    element.className = `${stored.original} ${stored.edit}`;
  }
</script>

<div class="mt-4 space-y-2 px-1">
  <p class="text-xs w-24 mr-2 text-start opacity-60">Tailwind</p>
  <Textarea
    class="w-full text-xs break-normal"
    placeholder="bg-red-500 text-white"
    on:input={(event) => {
      const newClass = event.currentTarget.value;
      editTool.selectorEngine.selected.forEach((element) => {
        applyClass(element, newClass);
      });
    }}
  />
</div>
