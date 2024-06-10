<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { MessageType } from "$shared/message";
    import { sendMessage } from "webext-bridge/window";
    import { onMount } from "svelte";
    import { camelCase } from "lodash";
    import { ApplyChangesService } from "$lib/tools/edit/applyChange";
    import type { InvokeParams, InvokeResponse } from "$shared/models";
    import type { EditTool } from "$lib/tools/edit";

    export let editTool: EditTool;
    export let cardHeight: string;
    let scrollContainer: HTMLDivElement;
    let waitingForResponse = false;

    // Chat state
    let chatHistoryMap: WeakMap<HTMLElement, any[]> = new Map();
    let chatHistory: any[] = [];
    let lastSelectedElement: HTMLElement;
    const applyChangeService = new ApplyChangesService();

    onMount(() => {
        editTool.selectorEngine.selectedStore.subscribe((selected) => {
            if (lastSelectedElement) {
                chatHistoryMap.set(lastSelectedElement, chatHistory);
            }
            if (selected && selected.length > 0) {
                // TODO: Handle multiple
                chatHistory = chatHistoryMap.get(selected[0]) || [];
                lastSelectedElement = selected[0];
            } else {
                chatHistory = [];
            }
        });
    });

    enum Roles {
        USER = "user",
        ASSISTANT = "assistant",
    }

    function addChatMessage(role: Roles, content: string) {
        chatHistory = [
            ...chatHistory,
            {
                role,
                content,
            },
        ];
    }

    function handleChatResponse(response: InvokeResponse) {
        console.log("Chat response", response);
        waitingForResponse = false;
        const selected = editTool.selectorEngine.selected;
        if (selected.length == 0) return;

        response.tool_calls.forEach((toolCall) => {
            // Handle style change
            if (toolCall.name === "style_change") {
                addChatMessage(Roles.ASSISTANT, toolCall.args.summary);

                selected.forEach((el) => {
                    toolCall.args.changes.forEach(({ property, value }) => {
                        applyChangeService.applyStyle(
                            el,
                            camelCase(property),
                            value,
                        );
                    });
                });
            }
        });

        if (response.content && response.content.length > 0) {
            addChatMessage(Roles.ASSISTANT, response.content);
        }
    }

    function submitMessage(event: Event) {
        event.preventDefault();
        event.currentTarget;
        const input = event.currentTarget as HTMLInputElement;
        const content = input.value;

        chatHistory = [
            ...chatHistory,
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
        class="w-full h-[calc({cardHeight}-170px)] text-xs overflow-auto overscroll-contain flex flex-col-reverse"
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
        {#each chatHistory.toReversed() as message, i}
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
    <div class="mt-4 p-[2px]">
        <Textarea
            class="h-8 min-h-8 max-h-8 resize-none m-0 text-xs p-0 ring-0 border-0 focus:border-0 focus:ring-0 active:border-0 active:ring-0 focus-visible:ring-0 focus-visible:border-0"
            placeholder="Type what you'd like to change..."
            maxlength={140}
            on:keypress={(event) => {
                if (event.key === "Enter") {
                    submitMessage(event);
                }
            }}
        />
    </div>
</div>
