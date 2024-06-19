<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { MessageType } from "$shared/message";
    import { onMount } from "svelte";
    import { sendMessage } from "webext-bridge/window";
    import * as Card from "$lib/components/ui/card";

    let stage = 0;
    let maxStage = 3;
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
        fixed inset-0 z-50 flex bg-black/40"
>
    {#if stage === 0}
        <Card.Root class="bg-blue-500/95 w-[40rem] max-w-2/3 mx-auto my-auto">
            <Card.Header class="text-xl">Ready for something new?</Card.Header>
            <Card.Content class="px-6">
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
        <Card.Root
            class="w-[20rem] h-[15rem] mt-[8rem] ml-auto mr-[13rem] bg-blue-500/95 rounded-tr-none"
        >
            <Card.Header class="text-lg">Change any styles</Card.Header>
            <Card.Content class="text-sm px-6">
                <div>
                    Click on any element on the page to start editing. Double
                    click to edit text. <br /><br />You can use the design tools
                    or try our AI assistant.
                </div>
            </Card.Content>
            <Card.Footer class="flex flex-row gap-2">
                <Button
                    class="ml-auto"
                    variant="ghost"
                    on:click={() => (stage -= 1)}
                >
                    Back
                </Button>
                <Button on:click={() => (stage += 1)}>Next</Button>
            </Card.Footer>
        </Card.Root>
    {:else if stage === 2}
        <Card.Root
            class="w-[20rem] h-[15rem] mt-[5rem] ml-[10rem] bg-blue-500/95 rounded-tl-none"
        >
            <Card.Header class="text-lg">See your changes</Card.Header>
            <Card.Content class="text-sm px-6">
                <div>
                    Your changes are recorded in the changes tab. <br /> <br /> You
                    can toggle the change or undo with cmd+z.
                </div>
            </Card.Content>
            <Card.Footer class="flex flex-row gap-2">
                <Button
                    class="ml-auto"
                    variant="ghost"
                    on:click={() => (stage -= 1)}
                >
                    Back
                </Button>
                <Button on:click={() => (stage += 1)}>Next</Button>
            </Card.Footer>
        </Card.Root>
    {:else if stage === 3}
        <Card.Root
            class="w-[20rem] h-[15rem] mt-[5rem] ml-auto mr-[15rem] bg-blue-500/95 rounded-tr-none"
        >
            <Card.Header class="text-lg">Share your design</Card.Header>
            <Card.Content class="text-sm px-6">
                <div>
                    Once finished, share your changes with a colleague. <br />
                    <br />Your changes are recorded as code that can be easily
                    used in your project.
                </div>
            </Card.Content>
            <Card.Footer class="flex flex-row gap-2">
                <Button
                    class="ml-auto"
                    variant="ghost"
                    on:click={() => (stage -= 1)}
                >
                    Back
                </Button>
                <Button on:click={() => (stage += 1)}>Finish</Button>
            </Card.Footer>
        </Card.Root>
    {/if}
</div>
