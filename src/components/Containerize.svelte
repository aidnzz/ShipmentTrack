<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    let dialogOpen = false;

    export function show(waybill: number): void { 
        dialogOpen = true; 
    }
</script>

<Dialog.Root bind:open={dialogOpen}>
    <Dialog.Content class="max-w-[305px] sm:max-w-[480px]">
        <Dialog.Header>
            <Dialog.Title>Containerize</Dialog.Title>
            <Dialog.Description>
                Containerize all the pieces of a waybill
            </Dialog.Description>
        </Dialog.Header>
    </Dialog.Content>
</Dialog.Root>