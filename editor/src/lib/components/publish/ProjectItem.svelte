<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { timeSince } from "$shared/helpers";
    import { ProjectStatus, type Project } from "$shared/models";
    import { CheckCircled } from "radix-icons-svelte";

    export let project: Project;
    export let selected = false;
</script>

<div class="flex flex-row items-center w-full">
    <Avatar.Root class="w-8 h-8">
        <Avatar.Image
            src={project.hostData?.favicon || ""}
            alt={project.name}
        />
        <Avatar.Fallback></Avatar.Fallback>
    </Avatar.Root>
    <div class="text-sm ml-2 flex flex-row items-center w-full">
        <div class="text-start">
            <p class="truncate w-64">
                {project.name}
            </p>
            <p class="text-xs text-tertiary">
                {project.status === ProjectStatus.PUBLISHED ? "" : "Draft · "}
                Last edited {timeSince(
                    new Date(project.updatedAt ?? project.createdAt),
                )} ago
            </p>
        </div>
        {#if selected}
            <CheckCircled class="ml-auto w-4 h-4 text-green-500" />
        {/if}
    </div>
</div>
