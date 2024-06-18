<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    let stage = 0;
    let maxStage = 3;
    $: tourVisible = stage <= maxStage;
</script>

<div
    class="{tourVisible ? 'visible' : 'invisible'} 
        fixed inset-0 z-50 flex bg-black/40"
>
    {#if stage === 0}
        <Card.Root class="bg-blue-500/95 w-[40rem] max-w-2/3 mx-auto my-auto">
            <Card.Header class="text-xl">Welcome to Onlook</Card.Header>
            <Card.Content class="text-sm px-6">
                <div>
                    Onlook lets you design directly on the live page, no canvas
                    needed.
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
            class="w-[20rem] h-[12rem] mt-[10rem] ml-auto mr-[15rem] bg-blue-500/95 rounded-tr-none"
        >
            <Card.Header class="text-xl">Change any styles</Card.Header>
            <Card.Content class="text-sm px-6">
                <div>
                    Use the editor panel to update styles. Double click the
                    element to edit text.
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
            class="w-[20rem] h-[12rem] mt-[5rem] ml-[10rem] bg-blue-500/95 rounded-tl-none"
        >
            <Card.Header class="text-xl">See your changes</Card.Header>
            <Card.Content class="text-sm px-6">
                <div>You can undo with CMD+Z or redo with CMD+Shift+Z.</div>
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
            class="w-[20rem] h-[13rem] mt-[5rem] ml-auto mr-[15rem] bg-blue-500/95 rounded-tr-none"
        >
            <Card.Header class="text-xl"
                >Share or publish your design</Card.Header
            >
            <Card.Content class="text-sm px-6">
                <div>
                    Once finished, share your changes with a colleague or
                    publish a code review. This will save time for your
                    developer.
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
