<script lang="ts">
    import type { EditTool } from "$lib/tools/edit";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";

    export let editTool: EditTool;
    export let cardHeight: string;
</script>

<div class="w-full h-full">
    <div class="w-full h-[calc({cardHeight}-170px)]"></div>
    <Separator />
    <div class="mt-4 p-[2px]">
        <Input class="text-xs" type="text" placeholder="Your style change" />
    </div>
</div>
