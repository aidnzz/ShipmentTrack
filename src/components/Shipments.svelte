<script lang="ts">
    import Shipment from "./Shipment.svelte";
    import AddShipment from "./AddShipment.svelte";
    import ShipmentDialog from "./ShipmentDialog.svelte";
    import Containerize from "./Containerize.svelte";
    
    import type { ShipmentType } from "../types/shipment.type";
    import { shipments } from "../stores";

    import * as Accordion from "$lib/components/ui/accordion";
    import type { SvelteComponent } from "svelte";

    import * as database from "../firebase";

    let dialog: SvelteComponent;
    export let shipmentInput: HTMLElement;
    let containerizeDialog: SvelteComponent;

    let currentWaybill: number;

    function addShipment({detail: waybill}: {detail: number}): void {
        let track: string = "audio/start.wav";
        currentWaybill = waybill;

        if (waybill in $shipments.present) {
            shipments.update((s) => {
                s.present[waybill].count += 1;
                return s;
            });

            const {pieces, count} = $shipments.present[waybill];
            
            const cmp = pieces - count;
            track = cmp < 0 ? "audio/error.wav" : (cmp > 0 ? "audio/submit.wav" : "audio/completed.wav");
            
            database.incrementShipment(waybill);
        } else {
            dialog.show();
        }

        const audio = new Audio(track);
        audio.play();
    }

    function removeShipment(waybill: number): void {
        const {present, history} = $shipments;
        
        history[waybill] = present[waybill];
        delete present[waybill];
        
        shipments.set({ present, history });
        database.deleteShipment(waybill);
    }

    function restoreShipment(waybill: number): void {
        const {present, history} = $shipments;
        
        present[waybill] = history[waybill];
        delete history[waybill];
        
        shipments.set({ present, history });
        database.restoreShipment(waybill);
    }

    const sortShipments = ([_, x]: [any, ShipmentType], [__, y]: [any, ShipmentType]): number => {
        let proportionX = x.count / x.pieces;
        let proportionY = y.count / y.pieces;
        return proportionY - proportionX;
    };

    function saveShipment({detail: d}: {detail: {count: number, pieces: number}}): void {
        shipments.update(({history, present: p}) => {
            const present = {...p, [currentWaybill]: {count: d.count, pieces: d.pieces}};
            return {present, history};
        });

        database.addShipment(currentWaybill, d);
    }
</script>

<AddShipment bind:input={shipmentInput} on:add={addShipment}/>

<ShipmentDialog bind:this={dialog} on:save={saveShipment} closeFocus={shipmentInput}/>
<Containerize bind:this={containerizeDialog}/>

<Accordion.Root class="mt-6" value={["current"]} multiple>
    <Accordion.Item value="current">
        <Accordion.Trigger>Current Shipments</Accordion.Trigger>
        <Accordion.Content>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {#each Object.entries($shipments.present).sort(sortShipments) as [id, {count, pieces}] (id)}
                    <Shipment {count} {pieces} waybill={Number(id)} onRemove={removeShipment} on:containerize={({detail}) => { containerizeDialog.show(detail) }}/>
                {/each}
            </div>
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="history">
        <Accordion.Trigger>History</Accordion.Trigger>
        <Accordion.Content>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {#each Object.entries($shipments.history).sort(sortShipments) as [id, {count, pieces}] (id)}
                    <Shipment {count} {pieces} waybill={Number(id)} onRestore={restoreShipment} on:containerize={({detail}) => { containerizeDialog.show(detail) }}/>
                {/each}
            </div>
      </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>