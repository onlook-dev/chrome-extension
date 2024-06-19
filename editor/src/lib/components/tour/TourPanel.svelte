<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { MessageType } from "$shared/message";
    import { onMount } from "svelte";
    import { sendMessage } from "webext-bridge/window";
    import * as Card from "$lib/components/ui/card";
    import TourStep from "./TourStep.svelte";

    let stage = 0;
    let maxStage = 4;
    let tourVisible = true;

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
            class="bg-blue-500/95 border-blue-400 w-[40rem] max-w-2/3 m-auto"
        >
            <Card.Header class="text-xl">Ready for something new?</Card.Header>
            <Card.Content class="text-base px-6">
                <div>
                    Unlike other design tools, Onlook lets you design directly
                    on the live page.<br /> This means your design is exactly how
                    it would look to your users.
                </div>
            </Card.Content>
            <Card.Footer class="flex flex-row gap-2">
                <Button
                    class="ml-auto"
                    variant="ghost"
                    on:click={() => (tourVisible = false)}
                >
                    Skip
                </Button>
                <Button on:click={() => (stage += 1)}>Start tour</Button>
            </Card.Footer>
        </Card.Root>
    {:else if stage === 1}
        <TourStep
            bind:stage
            classes="mt-[1rem] mr-[10rem] rounded-tr-none"
            headerText="Edit on any page"
        >
            <div>
                Click the extension icon to toggle the editor. <br />
                <br />
                Do this on any website to start designing that page.
            </div>
        </TourStep>
    {:else if stage === 2}
        <TourStep
            bind:stage
            classes="mt-[8rem] mr-[13rem] rounded-tr-none"
            headerText="Change any styles"
        >
            <div>
                Click on any element on the page to start editing. Double click
                to edit text. <br /> <br />You can use the design tools or try
                our AI assistant.
            </div>
        </TourStep>
    {:else if stage === 3}
        <TourStep
            bind:stage
            classes="mt-[5rem] ml-[10rem] rounded-tl-none"
            headerText="See your changes"
        >
            <div>
                Your changes are recorded in the changes tab. <br /> <br /> You can
                toggle the change or undo with cmd+z.
            </div>
        </TourStep>
    {:else if stage === 4}
        <TourStep
            bind:stage
            classes="mt-[5rem] mr-[15rem] rounded-tr-none"
            headerText="Share your changes"
            buttonText="Finish"
        >
            <div>
                Once finished, share your changes with a colleague.
                <br /> <br /> Changes are recorded as code that can be easily used
                in your project.
            </div>
        </TourStep>
    {/if}
</div>
