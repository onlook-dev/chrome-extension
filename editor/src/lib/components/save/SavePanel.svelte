<script lang="ts">
    import { draggable } from "@neodrag/svelte";
    import { savePanelVisible } from "$lib/states/editor";
    import { ToolManager, ToolName } from "$lib/tools";
    import { Dashboard, Pencil2, Share1, Share2 } from "radix-icons-svelte";
    import { onMount } from "svelte";

    import Logo from "./Logo.svelte";
    import Button from "../ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Accordion from "$lib/components/ui/accordion";

    import type { SaveTool } from "$lib/tools/save";
    import type { Project } from "$shared/models";
    import { slide } from "svelte/transition";
    import SelectProjectView from "./SelectProjectView.svelte";

    export let toolManager: ToolManager;

    let saveTool: SaveTool = toolManager.saveTool;
    let isInputFocused = false;
    let currentProject: Project | undefined = {
        name: "New Project",
        hostData: {
            favicon: "",
        },
    };
    let projects: Project[] | any[] = [
        currentProject,
        currentProject,
        currentProject,
        currentProject,
        currentProject,
        currentProject,
        currentProject,
        currentProject,
    ];

    const accordianItem = "item-1";
    let accordianValue = "";
    $: accordianExpanded = accordianValue === accordianItem;

    onMount(() => {
        saveTool.currentProjectStore.subscribe((value) => {
            if (!value) return;
            currentProject = value;
        });
    });
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
    class="fixed top-[calc(50vh-200px)] left-[calc(50vw-170px)] {$savePanelVisible
        ? 'visible'
        : 'invisible'}"
>
    <Card.Root
        class="w-[400px] h-[{accordianExpanded
            ? '400px'
            : '200px'}] backdrop-blur bg-background/90 pt-2"
        style="transition: height 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);"
    >
        <Card.Header class="space-y-6">
            <div class="flex flex-row items-center">
                <Logo class="w-24" />
                <Share2
                    class="w-5 h-5 text-tertiary ml-auto hover:text-stone-400 cursor-pointer"
                />
            </div>
            {#if !accordianExpanded}
                <div
                    transition:slide
                    class="grid grid-flow-col justify-items-stretch space-x-4"
                >
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
            {/if}
        </Card.Header>
        <Card.Content class="">
            <div class="">
                {#if currentProject}
                    <Accordion.Root bind:value={accordianValue}>
                        <Accordion.Item
                            class="border-b-0"
                            value={accordianItem}
                        >
                            <Accordion.Trigger
                                chevron={true}
                                class="w-full mx-2 pt-0 mt-0 border-b-0 "
                            >
                                {#if accordianExpanded}
                                    <p class="text-tertiary">
                                        Select a project to save changes to
                                    </p>
                                {:else}
                                    <SelectProjectView
                                        project={currentProject}
                                    />
                                {/if}
                            </Accordion.Trigger>
                            <Accordion.Content
                                class="px-2 max-h-[280px] overflow-auto"
                            >
                                {#each projects as project}
                                    <div class="mb-6">
                                        <SelectProjectView {project} />
                                    </div>
                                {/each}
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion.Root>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>
</div>
