<script lang="ts">
    import type { EditTool } from "$lib/tools/edit";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";

    export let editTool: EditTool;
    export let cardHeight: string;
    let scrollContainer: HTMLDivElement;

    let messages: any[] = [
        {
            role: "user",
            content: "1!",
        },
        {
            role: "assistant",
            content: "2?",
        },
        {
            role: "user",
            content: "3, world!",
        },
        {
            role: "assistant",
            content: "4! How can I help you today?",
        },
        {
            role: "user",
            content: "5, world!",
        },
        {
            role: "assistant",
            content: "6! How can I help you today?",
        },
        {
            role: "user",
            content: "7, world!",
        },
        {
            role: "assistant",
            content: "8! How can I help you today?",
        },
        {
            role: "user",
            content: "9, world!",
        },
        {
            role: "assistant",
            content: "10! How can I help you today?",
        },
        {
            role: "user",
            content: "11, world!",
        },
        {
            role: "assistant",
            content: "12! How can I help you today?",
        },
    ];

    function submitMessage(event: Event) {
        event.preventDefault();
        event.currentTarget;
        const input = event.currentTarget as HTMLInputElement;
        const message = input.value;
        messages = [
            ...messages,
            {
                role: "user",
                content: message,
            },
        ];
        input.value = "";
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
</script>

<div class="w-full h-full">
    <div
        class="w-full h-[calc({cardHeight}-160px)] text-xs overflow-auto overscroll-contain flex flex-col-reverse"
        bind:this={scrollContainer}
    >
        {#each messages.toReversed() as message, i}
            {#if message.role === "assistant"}
                <div class="flex items-start gap-3 my-1.5">
                    <div
                        class="bg-stone-800 rounded rounded-bl-none p-3 max-w-[70%]"
                    >
                        <p>{message.content}</p>
                    </div>
                </div>
            {/if}

            {#if message.role === "user"}
                <div class="flex items-start gap-3 my-1.5 justify-end">
                    <div
                        class="bg-violet-800 rounded rounded-br-none p-3 max-w-[70%]"
                    >
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
            on:keypress={(event) => {
                if (event.key === "Enter") {
                    submitMessage(event);
                }
            }}
        />
    </div>
</div>
