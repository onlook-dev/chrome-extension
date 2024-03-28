<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea";
  import { handleEditEvent } from "$lib/tools/edit/handleEvents";
  import { EditType } from "$shared/models/editor";

  export let el: HTMLElement;
  export let editTool;
  $: value = elementToClass.get(el) || { original: "", edit: "" };

  let elementToClass: WeakMap<HTMLElement, { original: string; edit: string }> =
    new WeakMap();

  function applyClass(element: HTMLElement, newClass: string) {
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
    handleEditEvent({
      el: element,
      editType: EditType.ATTR,
      newValue: { class: stored.edit },
      oldValue: { class: "" },
    });
  }
</script>

<div class="mt-4 space-y-2 px-1">
  <p class="text-xs w-24 mr-2 text-start opacity-60">Tailwind</p>
  <Textarea
    class="w-full text-xs break-normal"
    placeholder="bg-red-500 text-white"
    value={value.edit || ""}
    on:input={(event) => {
      const newClass = event.currentTarget.value;
      editTool.selectorEngine.selected.forEach((element) => {
        applyClass(element, newClass);
      });
    }}
  />
</div>
