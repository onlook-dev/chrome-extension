<script lang="ts">
    import type { EditTool } from "$lib/tools/edit";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { MessageType } from "$shared/message";
    import { sendMessage } from "webext-bridge/window";

    export let editTool: EditTool;
    export let cardHeight: string;
    let scrollContainer: HTMLDivElement;
    let waitingForResponse = false;

    enum Roles {
        USER = "user",
        ASSISTANT = "assistant",
    }

    let messages: any[] = [];

    function handleChatResponse(response: { summary: string; changes: any[] }) {
        editTool.applyStyles(response.changes);
        waitingForResponse = false;
        messages = [
            ...messages,
            {
                role: Roles.ASSISTANT,
                content: response.summary,
            },
        ];
    }

    function submitMessage(event: Event) {
        event.preventDefault();
        event.currentTarget;
        const input = event.currentTarget as HTMLInputElement;
        const content = input.value;

        messages = [
            ...messages,
            {
                role: Roles.USER,
                content,
            },
        ];

        // Send message to chat service in background
        sendMessage(MessageType.SEND_CHAT_MESSAGE, { content }).then(
            handleChatResponse,
        );

        waitingForResponse = true;
        input.value = "";

        setTimeout(() => {
            scrollContainer.scrollTo({
                top: scrollContainer.scrollHeight,
                behavior: "smooth",
            });
        }, 0);
    }
</script>

<div class="w-full h-full">
    <div
        class="w-full h-[calc({cardHeight}-160px)] text-xs overflow-auto overscroll-contain flex flex-col-reverse"
        bind:this={scrollContainer}
    >
        {#if waitingForResponse}
            <div class="flex items-start gap-3 my-1.5 opacity-70">
                <div
                    class="bg-stone-800 rounded rounded-bl-none p-3 max-w-[70%]"
                >
                    <p>...</p>
                </div>
            </div>
        {/if}
        {#each messages.toReversed() as message, i}
            {#if message.role === Roles.ASSISTANT}
                <div class="flex items-start gap-3 my-1.5">
                    <div
                        class="bg-stone-800 rounded rounded-bl-none p-3 max-w-[70%]"
                    >
                        <p>{message.content}</p>
                    </div>
                </div>
            {/if}

            {#if message.role === Roles.USER}
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
