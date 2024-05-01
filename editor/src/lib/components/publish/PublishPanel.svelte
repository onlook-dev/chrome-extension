<script lang="ts">
    import { draggable } from "@neodrag/svelte";
    import { savePanelVisible } from "$lib/states/editor";
    import { ToolManager, ToolName } from "$lib/tools";
    import { Dashboard, Pencil2, Shadow, Share2 } from "radix-icons-svelte";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    import Logo from "./Logo.svelte";
    import Button from "../ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Accordion from "$lib/components/ui/accordion";
    import ProjectItem from "./ProjectItem.svelte";

    import type { PublishTool } from "$lib/tools/publish";
    import type { Project } from "$shared/models";

    export let toolManager: ToolManager;

    let publishTool: PublishTool = toolManager.publishTool;
    let isInputFocused = false;
    let currentProject: Project | undefined;
    let projects: Project[] = [];
    let selectableProjects = [];

    $: if (currentProject) {
        selectableProjects = [
            currentProject,
            ...projects
                .filter((p) => p.id !== currentProject?.id)
                .sort((a, b) => {
                    return (a.updatedAt || a.createdAt) >
                        (b.updatedAt || b.createdAt)
                        ? -1
                        : 1;
                }),
        ];
    }

    const accordianItem = "item-1";
    let accordianValue = "";
    $: accordianExpanded = accordianValue === accordianItem;

    onMount(() => {
        publishTool.currentProjectStore.subscribe((value) => {
            if (!value || Object.keys(value).length === 0) return;
            currentProject = value;
        });

        publishTool.projectsStore.subscribe((value) => {
            if (!value || value.length === 0) return;
            projects = value;
        });
    });

    function selectProject(project: Project) {
        accordianValue = "";
        if (currentProject?.id === project.id) return;
        publishTool.merge(project);
    }
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
    class="fixed top-[calc(50vh-{accordianExpanded
        ? '200px'
        : '100px'})] left-[calc(50vw-170px)] {$savePanelVisible
        ? 'visible'
        : 'invisible'}"
    style="transition: top 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);"
>
    <Card.Root
        class="w-[400px] h-[{accordianExpanded
            ? '400px'
            : '200px'}] backdrop-blur bg-background/90 pt-2 overflow-hidden"
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
                    <Button
                        variant="primary"
                        disabled={!currentProject}
                        on:click={() => {
                            publishTool.publish();
                        }}><Dashboard class="mr-2" />Open in Dashboard</Button
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
                                    <ProjectItem project={currentProject} />
                                {/if}
                            </Accordion.Trigger>
                            <Accordion.Content
                                class="px-2 max-h-[280px] overflow-auto overscroll-contain"
                            >
                                {#each selectableProjects as project}
                                    <button
                                        class="w-full"
                                        on:click={() => selectProject(project)}
                                    >
                                        <div
                                            class="transition rounded py-3 cursor-pointer hover:bg-surface px-2 -mx-2"
                                        >
                                            <ProjectItem
                                                {project}
                                                selected={currentProject.id ===
                                                    project.id}
                                            />
                                        </div>
                                    </button>
                                {/each}
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion.Root>
                {:else}
                    <div
                        class="text-tertiary text-sm flex flex-row justify-center items-center mt-2"
                    >
                        <p>Loading project</p>
                        <Shadow class=" ml-2 w-4 h-4 animate-spin" />
                    </div>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>
</div>
