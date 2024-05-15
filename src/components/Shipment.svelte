<script lang="ts">
    import Icon from "@iconify/svelte";
    import { Button } from "$lib/components/ui/button";
    import { Progress } from "$lib/components/ui/progress/index.js";
    import { createEventDispatcher } from "svelte";

    import * as Card from "$lib/components/ui/card";

    type EventType = (waybill: number) => void;

    export let onRemove: EventType | undefined = undefined;
    export let onRestore: EventType | undefined = undefined;

    export let count: number;
    export let pieces: number;
    export let waybill: number;

    const dispatch = createEventDispatcher();

    const handler = [
        {
            run: onRemove, 
            icon: "material-symbols:delete-outline"
        }, 
        {
            run: onRestore,
            icon: "ic:outline-restore"
        }
    ].find(({run}) => run !== undefined) as {run: EventType, icon: string} | undefined;
</script>

<Card.Root>
    <Card.Header class="flex-row justify-between items-baseline">
        <Card.Title tag="h1" class="font-bold text-lg">{waybill}</Card.Title>
        {#if handler}
            <Button variant="outline" type="button" size="sm" on:click={() => handler.run(waybill)}>
                <Icon icon={handler.icon} class="w-4 h-4"/>
            </Button>
        {/if}
    </Card.Header>
    
    <Card.Content>
        <div class="mb-6">
            <h3 class="font-semibold">Total Pieces {pieces}</h3>
            <h3 class="font-semibold">Found {count}</h3>
        </div>
        <Progress value={count / pieces * 100}/>
    </Card.Content>
    <Card.Footer class="grid grid-cols-2 gap-2">
        <Button variant="outline" href="https://google.com" target="_blank" size="sm">Release</Button>
        <Button type="button" size="sm" on:click={() => { dispatch("containerize", waybill) }}>Containerize</Button>
    </Card.Footer>
</Card.Root>