<script lang="ts">
  import { Accordion as AccordionPrimitive } from "bits-ui";
  import { ChevronDown } from "radix-icons-svelte";
  import { cn } from "$lib/utils";

  type $$Props = AccordionPrimitive.TriggerProps & {
    chevron?: boolean;
  };
  type $$Events = AccordionPrimitive.TriggerEvents;

  let className: $$Props["class"] = undefined;
  export let level: AccordionPrimitive.HeaderProps["level"] = 3;
  export { className as class };
  export let chevron = false;
</script>

<AccordionPrimitive.Header {level} class="flex">
  <AccordionPrimitive.Trigger
    class={cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180",
      className,
    )}
    {...$$restProps}
    on:click
  >
    <slot />
    {#if chevron}
      <ChevronDown
        class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
      />
    {/if}
  </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
