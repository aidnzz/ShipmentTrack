<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let count: string | number = 1;
    let pieces: string | number = 1;

    let dialogOpen = false;

    export let closeFocus: HTMLElement;

    export function show(): void { 
        dialogOpen = true; 
    }

    export function hide(): void {
        dialogOpen = false;
        setTimeout(() => closeFocus.focus(), 0); // IDFK
    }

    function processInput(): void {
        const convert = (s: number | string): number => typeof s == "string" ? parseInt(s) : s;

        const data = {
            count: convert(count),
            pieces: convert(pieces),
        };
        
        dispatch("save", data);
        hide();
        // Reset count
        count = 1;
    }
</script>

<Dialog.Root bind:open={dialogOpen} closeOnEscape={false} closeOnOutsideClick={false} closeFocus={closeFocus}>
    <Dialog.Content class="max-w-[305px] sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Add Shipment</Dialog.Title>
            <Dialog.Description>
                New shipment scanned enter shipment details.
            </Dialog.Description>
        </Dialog.Header>
        <form on:submit|preventDefault={processInput} class="grid grid-cols-4 lg:grid-cols-6 items-center gap-4">
            <Label for="pieces">Pieces</Label>
            <Input id="pieces" type="number" class="col-span-3 lg:col-span-5" bind:value={pieces} />
            <Label for="count">Count</Label>
            <Input id="count" type="number" class="col-span-3 lg:col-span-5" bind:value={count} />
            <Button type="submit" variant="default" class="col-span-4 lg:col-span-6">Save changes</Button>    
        </form>
    </Dialog.Content>
</Dialog.Root>