<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    export let classes = "";
    export let stage;
    export let buttonText = "Next";
    export let headerText = "How to use Onlook";
    export let callback: (() => void) | undefined = undefined;
</script>

<Card.Root class="w-[20rem] bg-blue-500/95 border-blue-400 m-auto {classes}">
    <Card.Header class="text-lg">{headerText}</Card.Header>
    <Card.Content class="text-sm px-6">
        <slot />
    </Card.Content>
    <Card.Footer class="flex flex-row gap-2">
        <Button class="ml-auto" variant="ghost" on:click={() => (stage -= 1)}>
            Back
        </Button>
        <Button
            on:click={() => {
                stage += 1;
                callback && callback();
            }}>{buttonText}</Button
        >
    </Card.Footer>
</Card.Root>
