<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";

    export let classes = "";
    export let stage: number;
    export let maxStage: number;
    export let buttonText = "Next";
    export let headerText = "How to use Onlook";
    export let callback: (() => void) | undefined = undefined;
</script>

<Card.Root
    class="p-4 space-y-4 w-[20rem] max-w-[400px] bg-blue-600 border-blue-900 border-[0.5px] m-auto {classes}"
>
    <Card.Header class="p-0">
        <h1 class="text-base text-blue-900">Step {stage} of {maxStage}</h1>
        <h1 class="text-lg">{headerText}</h1>
    </Card.Header>
    <Card.Content class="text-sm p-0 text-blue-1000">
        <slot />
    </Card.Content>
    <Card.Footer class="p-0 flex flex-row gap-2 ">
        <Button
            class="ml-auto text-blue-700 rounded hover:bg-blue-400"
            variant="ghost"
            on:click={() => (stage -= 1)}>Back</Button
        >
        <Button
            class="rounded text-blue-300"
            on:click={() => {
                stage += 1;
                callback && callback();
            }}>{buttonText}</Button
        >
    </Card.Footer>
</Card.Root>
