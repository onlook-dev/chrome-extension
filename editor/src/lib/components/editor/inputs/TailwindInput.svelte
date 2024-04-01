<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea";
  export let classUpdated: boolean = false;
  export let appendedClass: string = "";
  export let updateElementClass: (value: string) => void;

  function handleNewInput(event: Event) {
    if (classUpdated) {
      classUpdated = false;
      return;
    }
    const newClass = (event.target as HTMLInputElement).value;
    if (newClass === "" && newClass === appendedClass) return;
    updateElementClass(newClass);
  }
</script>

<div class="mt-4 space-y-2 px-1">
  <p class="text-xs w-24 mr-2 text-start opacity-60">Tailwind</p>
  <Textarea
    class="w-full text-xs break-normal"
    placeholder="bg-red-500 text-white"
    value={appendedClass}
    on:input={handleNewInput}
  />
</div>
