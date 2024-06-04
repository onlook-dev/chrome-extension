<script lang="ts">
    import type { EditTool } from "$lib/tools/edit";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";

    export let editTool: EditTool;
    export let cardHeight: string;

    let messages: any[] = [
        {
            role: "user",
            content: "Hello, world!",
        },
        {
            role: "assistant",
            content: "Hi! How can I help you today?",
        },
        {
            role: "user",
            content: "Hello, world!",
        },
        {
            role: "assistant",
            content: "Hi! How can I help you today?",
        },
        {
            role: "user",
            content: "Hello, world!",
        },
        {
            role: "assistant",
            content: "Hi! How can I help you today?",
        },
        {
            role: "user",
            content: "Hello, world!",
        },
        {
            role: "assistant",
            content: "Hi! How can I help you today?",
        },
        {
            role: "user",
            content: "Hello, world!",
        },
        {
            role: "assistant",
            content: "Hi! How can I help you today?",
        },
        {
            role: "user",
            content: "Hello, world!",
        },
        {
            role: "assistant",
            content: "Hi! How can I help you today?",
        },
    ];
</script>

<div class="w-full h-full">
    <div
        class="w-full h-[calc({cardHeight}-160px)] text-xs space-y-4 overflow-auto"
    >
        {#each messages as message, i}
            {#if message.role === "user"}
                <div class="flex items-start gap-3">
                    <div class="bg-stone-800 rounded p-3 max-w-[70%]">
                        <p>{message.content}</p>
                    </div>
                </div>
            {/if}
            {#if message.role === "assistant"}
                <div class="flex items-start gap-3 justify-end">
                    <div class="bg-violet-800 rounded p-3 max-w-[70%]">
                        <p>{message.content}</p>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
    <Separator />
    <div class="mt-2 p-[2px]">
        <Input
            class="m-0 text-xs p-0 ring-0 border-0 focus:border-0 focus:ring-0 active:border-0 active:ring-0 focus-visible:ring-0 focus-visible:border-0"
            type="text"
            placeholder="Type what you'd like to change..."
        />
    </div>
</div>
