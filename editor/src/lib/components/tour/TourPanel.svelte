<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { MessageType } from "$shared/message";
    import { onMount } from "svelte";
    import { sendMessage } from "webext-bridge/window";
    import TourStep from "./TourStep.svelte";

    let stage = 0;
    let maxStage = 4;
    let tourVisible = false;

    $: if (stage > maxStage) {
        tourVisible = false;
    }

    onMount(() => {
        setTimeout(async () => {
            const shouldTour = await sendMessage(MessageType.SHOULD_TOUR, {});
            if (shouldTour) {
                tourVisible = true;
            }
        }, 500);
    });
</script>

<div
    class="{tourVisible ? 'visible' : 'invisible'} 
        fixed inset-0 z-50 w-screen h-screen flex {stage === 0
        ? 'bg-black/40'
        : ''}"
>
    {#if stage === 0}
        <Card.Root
            class="bg-blue-600 border-blue-900 w-[40rem] max-w-2/3 m-auto"
        >
            <Card.Header class="text-xl">Ready for something new?</Card.Header>
            <Card.Content class="text-base px-6 text-blue-1000">
                <ul>
                    <li>
                        Unlike other design tools, Onlook lets you design
                        directly on the live page.
                    </li>
                    <li>
                        This means your design is exactly how it would look to
                        your users.
                    </li>
                </ul>
            </Card.Content>
            <Card.Footer class="flex flex-row gap-2">
                <Button
                    class="ml-auto text-blue-700 rounded hover:bg-blue-400"
                    variant="ghost"
                    on:click={() => (tourVisible = false)}
                >
                    Skip
                </Button>
                <Button
                    class="rounded text-blue-300"
                    on:click={() => (stage += 1)}>Start tour</Button
                >
            </Card.Footer>
        </Card.Root>
    {:else if stage === 1}
        <TourStep
            bind:stage
            {maxStage}
            classes="mt-[1rem] mr-[10rem] rounded-tr-none"
            headerText="Edit on any page"
        >
            <ul class="list-disc pl-5">
                <li>Click the extension icon to toggle the editor</li>
                <li>Do this on any website to start designing</li>
            </ul>
        </TourStep>
    {:else if stage === 2}
        <TourStep
            bind:stage
            {maxStage}
            classes="mt-[8rem] mr-[13rem] rounded-tr-none"
            headerText="Change any styles"
        >
            <ul class="list-disc pl-5">
                <li>Click on any element on the page to start editing</li>
                <li>Double click to edit text</li>
                <li>Making complex change? Try our AI assistant</li>
            </ul>
        </TourStep>
    {:else if stage === 3}
        <TourStep
            bind:stage
            {maxStage}
            classes="mt-[5rem] ml-[10rem] rounded-tl-none"
            headerText="See your changes"
        >
            <ul class="list-disc pl-5">
                <li>Your changes are recorded in the changes tab</li>
                <li>Click to toggle the change or undo with cmd+z</li>
            </ul>
        </TourStep>
    {:else if stage === 4}
        <TourStep
            bind:stage
            {maxStage}
            classes="mt-[5rem] mr-[15rem] rounded-tr-none"
            headerText="Share your changes"
            buttonText="Finish"
        >
            <ul class="list-disc pl-5">
                <li>Once finished, share your changes with a colleague</li>
                <li>
                    Changes are recorded as code that can be used in your
                    project
                </li>
            </ul>
        </TourStep>
    {/if}
</div>
