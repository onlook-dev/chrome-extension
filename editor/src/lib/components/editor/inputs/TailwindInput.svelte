<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea";
  export let appendedClass: string[];
  export let updateElementClass: (value: string) => void;

  function handleNewInput(event: Event) {
    const newClass = (event.currentTarget as HTMLInputElement).value;
    updateElementClass(newClass);
  }
</script>

<div class="mt-4 space-y-2 px-1">
  <p class="text-xs w-24 mr-2 text-start opacity-60">Tailwind</p>
  <Textarea
    class="w-full text-xs break-normal"
    placeholder="Add tailwind classes here"
    value={appendedClass.length > 0 ? appendedClass[0] : ""}
    on:input={handleNewInput}
  />
</div>
