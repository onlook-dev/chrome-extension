<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import type { Project } from "$shared/models";

    export let project: Project;
</script>

<div class="flex flex-row items-center">
    <Avatar.Root class="w-8 h-8">
        <Avatar.Image src={project.hostData.favicon} alt={project.name} />
        <Avatar.Fallback></Avatar.Fallback>
    </Avatar.Root>
    <p class="text-sm ml-2">
        {project.name}
    </p>
</div>
