<script lang="ts">
  import type { EditTool } from "$lib/tools/edit";
  import Button from "../ui/button/button.svelte";

  export let editTool: EditTool;

  function insertElement() {
    console.log("Inserting element");
    editTool.insertElement(createStyledButton("Click me"));
  }

  function createStyledButton(buttonText) {
    // Create the button element
    const button = document.createElement("button");

    // Set button text
    button.textContent = buttonText;

    // Style the button
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.color = "#fff";
    button.style.backgroundColor = "#007bff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    // Return the button element
    return button;
  }
</script>

<Button on:click={insertElement}>Insert button</Button>
