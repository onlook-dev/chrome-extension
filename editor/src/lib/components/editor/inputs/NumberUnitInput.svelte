<script lang="ts">
  import type { ElementStyle } from "$lib/tools/selection/styles";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;
  export let unitEnd: boolean = false;
  export let inputWidth: string = "w-8";
  export let unitWidth: string = "w-8";

  let parsedNumber: number = 0;
  let parsedUnit: string = "";
  let step = 1;
  let numberInputRef: HTMLInputElement;

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

  const parsedValueToString = (
    floatValue: number | string,
    unit: string,
  ): string => {
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
      bind:this={numberInputRef}
      type="text"
      class="{inputWidth} text-xs border-none text-text bg-transparent text-end focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      placeholder="--"
      value={isEmpty() ? "" : parsedNumber}
      {step}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
          return;
        }
        if (e.shiftKey) step = 10;

        if (e.key === "ArrowUp") {
          parsedNumber += step;
          e.preventDefault();
        } else if (e.key === "ArrowDown") {
          parsedNumber -= step;
          e.preventDefault();
        }

        const stringValue = parsedValueToString(parsedNumber, parsedUnit);
        updateElementStyle(elementStyle.key, stringValue);
      }}
      on:keyup={(e) => {
        if (!e.shiftKey) step = 1;
      }}
      on:input={(e) => {
        if (
          e.currentTarget.value &&
          e.currentTarget.value !== "" &&
          (parsedUnit === auto || parsedUnit === "")
        ) {
          parsedUnit = "px";
        }

        // Process into unit if necessary
        const matches = e.currentTarget.value.match(
          /([-+]?[0-9]*\.?[0-9]+)([a-zA-Z%]*)/,
        );
        // If unit matches elementStyle.units, assign number to parsedNumber and unit to parsedUnit
        if (matches && elementStyle.units.includes(matches[2])) {
          parsedNumber = parseFloat(matches[1]);
          parsedUnit = matches[2];
          numberInputRef.value = `${parsedNumber}`;
        } else {
          parsedNumber = parseFloat(e.currentTarget.value);
        }

        const stringValue = parsedValueToString(parsedNumber, parsedUnit);
        updateElementStyle(elementStyle.key, stringValue);
      }}
    />

    <select
      name={elementStyle.displayName}
      placeholder="auto"
      class="text-xs {unitWidth} border-none text-text bg-transparent appearance-none {unitEnd
        ? 'text-end'
        : 'text-start'} focus:outline-none focus:ring-0"
      on:input={(e) => {
        if (e.currentTarget.value === auto) {
          updateElementStyle(elementStyle.key, "inherit");
          parsedNumber = 0;
          parsedUnit = e.currentTarget.value;
          return;
        }
        parsedUnit = e.currentTarget.value;

        const stringValue = parsedValueToString(
          parsedNumber,
          e.currentTarget.value,
        );
        updateElementStyle(elementStyle.key, stringValue);
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
