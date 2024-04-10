<script lang="ts">
    import {
        Box,
        ViewHorizontal,
        ViewVertical,
        ViewGrid,
        Link2,
        Image,
        ListBullet,
        Video,
        Frame,
        Button,
        Input,
        DropdownMenu,
        Section,
        Pencil2,
        Text,
    } from "radix-icons-svelte";
    export let iconClass = "";
    export let node: HTMLElement | undefined;
</script>

{#if node?.nodeType == Node.TEXT_NODE || node?.tagName == "H1" || node?.tagName == "H2" || node?.tagName == "H3" || node?.tagName == "H4" || node?.tagName == "H5" || node?.tagName == "H6" || node?.tagName == "P" || node?.tagName == "STRONG" || node?.tagName == "EM" || node?.tagName == "SPAN" || node?.tagName == "I"}
    <Text class={iconClass} />
{:else if node?.tagName == "A"}
    <Link2 class={iconClass} />
{:else if node?.tagName == "IMG" || node?.tagName == "SVG"}
    <Image class={iconClass} />
{:else if node?.tagName == "VIDEO"}
    <Video class={iconClass} />
{:else if node?.tagName == "IFRAME"}
    <Frame class={iconClass} />
{:else if node?.tagName == "BUTTON"}
    <Button class={iconClass} />
{:else if node?.tagName == "INPUT"}
    <Input class={iconClass} />
{:else if node?.tagName == "UL" || node?.tagName == "OL"}
    <ListBullet class={iconClass} />
{:else if node?.tagName == "SECTION"}
    <Section class={iconClass} />
{:else if node?.tagName == "DIV"}
    {#if node?.style?.display == "grid"}
        <ViewGrid class={iconClass} />
    {:else if node?.style?.display == "flex"}
        {#if node?.style?.flexDirection == "column"}
            <ViewVertical class={iconClass} />
        {:else if node?.style?.flexDirection == "row"}
            <ViewHorizontal class={iconClass} />
        {:else}
            <Box class={iconClass} />
        {/if}
    {:else}
        <Box class={iconClass} />
    {/if}
{:else if node?.tagName == "TABLE" || node?.tagName == "THEAD" || node?.tagName == "TBODY" || node?.tagName == "TFOOT" || node?.tagName == "TR" || node?.tagName == "TH" || node?.tagName == "TD"}
    <ViewGrid class={iconClass} />
{:else if node?.tagName == "FORM"}
    <ViewHorizontal class={iconClass} />
{:else if node?.tagName == "SELECT" || node?.tagName == "OPTION"}
    <DropdownMenu class={iconClass} />
{:else if node?.tagName == "TEXTAREA"}
    <ViewVertical class={iconClass} />
{:else if node?.tagName == "CANVAS"}
    <Pencil2 class={iconClass} />
{:else}
    <Frame class={iconClass} />
{/if}
