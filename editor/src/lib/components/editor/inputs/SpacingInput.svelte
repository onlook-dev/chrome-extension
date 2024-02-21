<script lang="ts">
  import type { ElementStyle } from "$lib/tools/selection/styles";
  import NumberUnitInput from "./NumberUnitInput.svelte";
  export let elementStyles: ElementStyle[] = [];
  export let updateElementStyle: (key: string, value: string) => void;

  let elementStyleMap: Record<string, ElementStyle>;

  $: elementStyleMap = elementStyles.reduce((acc, style) => {
    acc[style.key] = style;
    return acc;
  }, {});
</script>

<div class="relative">
  <div
    class="absolute rounded bg-stone-300/50 opacity-10 w-[100px] h-[90px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40px] pointer-events-none"
  ></div>

  <div
    class="w-[198px] h-fit grid grid-cols-5 grid-rows-5 space-y-3 py-2 text-xs bg-background/50 border border-border rounded"
  >
    <div class="col-start-1 col-end-6 flex justify-center">
      <NumberUnitInput
        {updateElementStyle}
        elementStyle={elementStyleMap["marginTop"]}
      />
    </div>
    <div class="col-start-1 col-end-6 flex justify-center">
      <NumberUnitInput
        {updateElementStyle}
        elementStyle={elementStyleMap["paddingTop"]}
      />
    </div>
    <div class="col-start-1 col-end-6 flex justify-center">
      <NumberUnitInput
        inputWidth="w-6"
        unitWidth="w-6"
        {updateElementStyle}
        elementStyle={elementStyleMap["marginLeft"]}
      />
      <NumberUnitInput
        inputWidth="w-6"
        unitWidth="w-6"
        {updateElementStyle}
        elementStyle={elementStyleMap["paddingLeft"]}
      />
      <NumberUnitInput
        inputWidth="w-6"
        unitWidth="w-6"
        {updateElementStyle}
        elementStyle={elementStyleMap["paddingRight"]}
      />
      <NumberUnitInput
        inputWidth="w-6"
        unitWidth="w-6"
        {updateElementStyle}
        elementStyle={elementStyleMap["marginRight"]}
      />
    </div>
    <div class="col-start-1 col-end-6 flex justify-center">
      <NumberUnitInput
        {updateElementStyle}
        elementStyle={elementStyleMap["paddingBottom"]}
      />
    </div>
    <div class="col-start-1 col-end-6 flex justify-center">
      <NumberUnitInput
        {updateElementStyle}
        elementStyle={elementStyleMap["marginBottom"]}
      />
    </div>
  </div>
</div>
