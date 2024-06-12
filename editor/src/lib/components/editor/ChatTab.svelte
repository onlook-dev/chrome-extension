<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { MessageType } from "$shared/message";
    import { sendMessage } from "webext-bridge/window";
    import { onMount } from "svelte";
    import { camelCase } from "lodash";
    import { ApplyChangesService } from "$lib/tools/edit/applyChange";
    import {
        Tools,
        type InvokeParams,
        type InvokeResponse,
    } from "$shared/models";
    import type { EditTool } from "$lib/tools/edit";
    import { DATA_ONLOOK_ID } from "$shared/constants";
    import { Shadow } from "radix-icons-svelte";

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

    function handleChatResponse(response: InvokeResponse | any) {
        waitingForResponse = false;
        const selected = editTool.selectorEngine.selected;
        if (selected.length == 0) return;

        response.tool_calls.forEach((toolCall) => {
            // Handle style change
            if (toolCall.name === Tools.STYLE) {
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

    function getElementString(): string {
        if (!editTool.selectorEngine.selected.length) return;
        const element = editTool.selectorEngine.selected[0];
        let tagName = element.tagName.toLowerCase();
        let attributes = Array.from(element.attributes)
            .filter(
                (attr) =>
                    attr.name !== DATA_ONLOOK_ID &&
                    attr.name !== "data-old-vals",
            )
            .map((attr) => `${attr.name}="${attr.value}"`)
            .join(" ");
        let openingTag = `<${tagName} ${attributes}>`;

        // Construct the closing tag
        let closingTag = `</${tagName}>`;
        return `${openingTag}...${closingTag}`;
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

        const params = {
            content,
            element: getElementString(),
        } as InvokeParams;
        // Send message to chat service in background
        sendMessage(MessageType.SEND_CHAT_MESSAGE, params as any).then(
            handleChatResponse,
        );

        waitingForResponse = true;
        input.value = "";

        // Scroll to end of chat when new messages added
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
                    class="bg-stone-800 rounded rounded-bl-none p-2 max-w-[70%]"
                >
                    <Shadow class="animate-spin mx-1" />
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
