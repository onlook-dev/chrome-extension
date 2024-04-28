<script lang="ts">
    import { draggable } from "@neodrag/svelte";
    import { savePanelVisible } from "$lib/states/editor";
    import { ToolName, type ToolManager } from "$lib/tools";
    import { Dashboard, Pencil2 } from "radix-icons-svelte";

    import Logo from "./Logo.svelte";
    import * as Card from "$lib/components/ui/card";
    import Button from "../ui/button/button.svelte";

    export let toolManager: ToolManager;
    let isInputFocused = false;
</script>

<div
    use:draggable={{
        bounds: {
            top: 0,
            left: 0,
        },
        disabled: isInputFocused,
    }}
    on:focusin={() => (isInputFocused = true)}
    on:focusout={() => (isInputFocused = false)}
    class="fixed top-[calc(50vh-15vh)] left-[calc(50vw-170px)] {$savePanelVisible
        ? 'visible'
        : 'invisible'}"
>
    <Card.Root class="w-[400px] h-[340px] backdrop-blur bg-background/90 pt-2">
        <Card.Header class="space-y-4">
            <Logo class="w-24" />
            <div class="grid grid-flow-col justify-items-stretch space-x-4">
                <Button
                    variant="secondary"
                    on:click={() => {
                        toolManager.selectTool(ToolName.EDIT);
                    }}
                    ><Pencil2 class="mr-2" />
                    Resume Designing
                </Button>
                <Button variant="primary"
                    ><Dashboard class="mr-2" />Open in Dashboard</Button
                >
            </div>
        </Card.Header>
        <Card.Content>Hello</Card.Content>
    </Card.Root>
</div>
