<script lang="ts">
  import { updateValueToUnit } from "$lib/tools/edit/units";
  import type { ElementStyle } from "$lib/tools/selection/styles";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
  export let unitEnd: boolean = false;
  export let inputWidth: string = "w-8";
  export let unitWidth: string = "w-8";

  let parsedNumber: number = 0;
  let parsedUnit: string = "";
  const auto = "auto";

  $: [parsedNumber, parsedUnit] = stringToParsedValue(elementStyle.value);

  const stringToParsedValue = (val: string): [number, string] => {
    const matches = val.match(/([-+]?[0-9]*\.?[0-9]+)([a-zA-Z%]*)/);

    let num = matches ? parseFloat(matches[1]) : 0;
    let unit = matches && matches[2] ? matches[2] : "";

    // Handle opacity, if no parsed unit, convert to percentage
    if (elementStyle.key === "opacity" && unit === "") {
      unit = "%";
      num = num <= 1 ? num * 100 : num;
    }

    return [num, unit];
  };

  const parsedValueToString = (floatValue: number, unit: string): string => {
    return `${floatValue}${unit}`;
  };

  function isEmpty() {
    const numberIsEmpty = isNaN(parsedNumber) || parsedNumber === 0;
    const unitIsEmpty = parsedUnit === "";
    return numberIsEmpty && unitIsEmpty;
  }
</script>

{#if elementStyle}
  <div class="flex flex-row gap-1 justify-end">
    <input
      type="number"
      class="{inputWidth} text-xs border-none text-text bg-transparent text-end focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      placeholder="--"
      value={isEmpty() ? "" : parsedNumber}
      on:input={(e) => {
        const stringValue = parsedValueToString(e.target?.value, parsedUnit);
        if (stringValue !== elementStyle.value) {
          updateElementStyle(elementStyle.key, stringValue);
        }
      }}
    />

    <select
      name={elementStyle.displayName}
      placeholder="auto"
      class="text-xs {unitWidth} border-none text-text bg-transparent appearance-none {unitEnd
        ? 'text-end'
        : 'text-start'} focus:outline-none focus:ring-0"
      on:input={(e) => {
        if (e.target?.value === auto) {
          updateElementStyle(elementStyle.key, "inherit");
          parsedUnit = "";
          parsedNumber = 0;
          return;
        }

        let newNumber = updateValueToUnit(
          parsedNumber,
          parsedUnit,
          e.target?.value
        );
        const stringValue = parsedValueToString(newNumber, e.target?.value);
        if (stringValue !== elementStyle.value) {
          updateElementStyle(elementStyle.key, stringValue);
        }
        parsedNumber = newNumber;
      }}
      value={isEmpty() ? auto : parsedUnit}
    >
      <option value={auto}>{auto}</option>
      {#if parsedUnit !== "" && !elementStyle.units.includes(parsedUnit)}
        <option value={parsedUnit}>{parsedUnit}</option>
      {/if}
      {#each elementStyle.units ?? [] as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
{/if}
