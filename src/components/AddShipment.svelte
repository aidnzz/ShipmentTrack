<script lang="ts">
    import { onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';

    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input/index.js";

    const dispatch = createEventDispatcher();

    export let input: HTMLElement;
    let waybill: number | null | string;

    function submitShipment(): void {
        if (typeof waybill == "number") {
            dispatch("add", waybill);
        } else if (typeof waybill == "string") {
            dispatch("add", parseInt(waybill));
        } 
        
        waybill = null;
        input.focus();
    }

    onMount(() => { input.focus() });
</script>

<form on:submit|preventDefault={submitShipment} class="mt-1 flex w-full items-center space-x-2">
    <Input bind:value={waybill} bind:node={input} type="number" placeholder="Waybill number" pattern="^\d{3}$" autofocus required/>
    <Button disabled={!waybill} type="submit">Submit</Button>
</form>