<script lang="ts">
  import { NumberUnit } from "$lib/tools/selection/numberUnit";
  import { ChevronDown } from "radix-icons-svelte";
  import type { ElementStyle } from "$lib/tools/selection/styles";

  export let elementStyle: ElementStyle;
  export let updateElementStyle: (key: string, value: string) => void;

  let numberUnit = new NumberUnit();
  let parsedNumber: number = 0;
  let parsedUnit: string = "";
  let numberInputRef: HTMLInputElement;
  const auto = "auto";

  $: [parsedNumber, parsedUnit] = numberUnit.stringToParsedValue(
    elementStyle.value,
    elementStyle.key === "opacity",
  );

  function isEmpty() {
    const numberIsEmpty = isNaN(parsedNumber) || parsedNumber === 0;
    const unitIsEmpty = parsedUnit === "";
    return numberIsEmpty || unitIsEmpty;
  }
</script>

{#if elementStyle}
  <div class="flex flex-row gap-2 justify-end text-xs w-32">
    <input
      bind:this={numberInputRef}
      type="text"
      class="w-full p-[6px] px-2 rounded border-none text-text bg-surface text-start focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      placeholder="--"
      value={isEmpty() ? "" : parsedNumber}
      on:keydown={(e) => {
        let step = 1;
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

        const stringValue = numberUnit.parsedValueToString(
          parsedNumber,
          parsedUnit,
        );
        updateElementStyle(elementStyle.key, stringValue);
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

        const stringValue = numberUnit.parsedValueToString(
          parsedNumber,
          parsedUnit,
        );
        updateElementStyle(elementStyle.key, stringValue);
      }}
    />

    <div class="relative w-full">
      <select
        name={elementStyle.displayName}
        placeholder="auto"
        class="p-[6px] w-full px-2 rounded-sm border-none text-text bg-surface text-start appearance-none focus:outline-none focus:ring-0"
        on:input={(e) => {
          if (e.currentTarget.value === auto) {
            updateElementStyle(elementStyle.key, "initial");
            parsedNumber = 0;
            parsedUnit = e.currentTarget.value;
            return;
          }
          parsedUnit = e.currentTarget.value;

          const stringValue = numberUnit.parsedValueToString(
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
      <div
        class="text-tertiary absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
      >
        <ChevronDown />
      </div>
    </div>
  </div>
{/if}
