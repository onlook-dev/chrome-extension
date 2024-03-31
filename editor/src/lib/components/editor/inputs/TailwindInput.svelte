<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea";
  import {
    ApplyChangesService,
    type ClassValues,
  } from "$lib/tools/edit/applyChange";

  export let el: HTMLElement;
  export let editTool;
  let value: ClassValues = { oldVal: "", newVal: "" };
  const appyChangeService = new ApplyChangesService();

  $: if (el) {
    value = appyChangeService.getClassValue(el);
  }
</script>

<div class="mt-4 space-y-2 px-1">
  <p class="text-xs w-24 mr-2 text-start opacity-60">Tailwind</p>
  <Textarea
    class="w-full text-xs break-normal"
    placeholder="bg-red-500 text-white"
    value={value.newVal || ""}
    on:input={(event) => {
      const newClass = event.currentTarget.value;
      editTool.selectorEngine.selected.forEach((el) => {
        appyChangeService.applyClass(el, newClass);
      });
    }}
  />
</div>
