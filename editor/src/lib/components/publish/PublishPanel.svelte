<script lang="ts">
  import { savePanelVisible } from "$lib/states/editor";
  import { ToolManager, ToolName } from "$lib/tools";
  import { draggable } from "$lib/utils";
  import { ExternalLinks } from "$shared/constants";
  import {
    ChatBubble,
    Dashboard,
    Pencil2,
    Shadow,
    Share2,
  } from "radix-icons-svelte";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import * as Accordion from "$lib/components/ui/accordion";
  import * as Card from "$lib/components/ui/card";
  import Button from "../ui/button/button.svelte";
  import Logo from "./Logo.svelte";
  import ProjectItem from "./ProjectItem.svelte";

  import type { PublishTool } from "$lib/tools/publish";
  import type { Project } from "$shared/models";

  export let toolManager: ToolManager;

  let publishTool: PublishTool = toolManager.publishTool;
  let isInputFocused = false;
  let currentProject: Project | undefined;
  let projects: Project[] = [];
  let selectableProjects = [];
  let saving = false;
  let copied = false;

  $: if (currentProject) {
    selectableProjects = [
      currentProject,
      ...projects
        .filter((p) => p.id !== currentProject?.id)
        .sort((a, b) => {
          return (a.updatedAt || a.createdAt) > (b.updatedAt || b.createdAt)
            ? -1
            : 1;
        }),
    ];
  }

  const accordianItem = "item-1";
  let accordianValue = "";

  $: if ($savePanelVisible === true) {
    publishTool.getActiveProject();
    publishTool.getProjects();
  }

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

    publishTool.merge(project).then(() => {
      publishTool.getActiveProject();
      publishTool.getProjects();
    });
  }

  function publish() {
    if (!currentProject) return;
    saving = true;
    publishTool.publish().then(() => {
      saving = false;
    });
  }
</script>

<div
  use:draggable
  on:focusin={() => (isInputFocused = true)}
  on:focusout={() => (isInputFocused = false)}
  class="fixed top-[calc(50vh-{accordianExpanded
    ? '200px'
    : '100px'})] left-[calc(50vw-170px)] {$savePanelVisible
    ? 'visible'
    : 'invisible'}"
>
  <Card.Root
    class="w-[400px] h-[{accordianExpanded
      ? '400px'
      : '200px'}] backdrop-blur bg-background/90 pt-2 overflow-hidden"
    style="transition: height 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);"
  >
    <Card.Header data-drag-handle class="space-y-6">
      <div class="flex flex-row items-center text-tertiary">
        <Logo class="w-24" />
        <Button
          variant="ghost"
          class="ml-auto h-7 w-7 p-0"
          on:click={() => window.open(ExternalLinks.FEEDBACK_LINK, "_blank")}
        >
          <ChatBubble />
        </Button>
        <Button
          class="h-7 w-7 p-0 ml-2 disabled:text-tertiary"
          variant="ghost"
          on:click={() => {
            navigator.clipboard.writeText(
              `https://app.onlook.dev/dashboard/projects/${currentProject.id}`,
            );
            publishTool.publish(false);
            copied = true;
            setTimeout(() => {
              copied = false;
            }, 5000);
          }}
          disabled={copied}
        >
          {#if copied}
            Copied
          {:else}
            <Share2 />
          {/if}
        </Button>
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
            disabled={!currentProject || saving}
            on:click={publish}
          >
            {#if saving}
              <Shadow class="mr-2 animate-spin" />
              Saving project
            {:else}
              <Dashboard class="mr-2" />Save to Dashboard
            {/if}
          </Button>
        </div>
      {/if}
    </Card.Header>
    <Card.Content>
      <div>
        {#if currentProject}
          <Accordion.Root bind:value={accordianValue}>
            <Accordion.Item class="border-b-0" value={accordianItem}>
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
                        selected={currentProject.id === project.id}
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
