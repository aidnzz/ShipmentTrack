<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import * as Select from "$lib/components/ui/select";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

	import { resetMode, setMode, mode } from "mode-watcher";

    import Icon from "@iconify/svelte";
    import { serverURL } from "../constants";

    import { clearHistory, changeHUCode } from "../firebase";
    import { shipments, huCode } from "../stores";
    import type { FocusProp } from "bits-ui";

    export let closeFocus: FocusProp | undefined = undefined;
    let openDialog: boolean = false;

    function deleteHistory(): void {
        shipments.update(s => { return {present: s.present, history: {}} });
        clearHistory();
    }

    function saveSettings(): void {
        changeHUCode($huCode);
    }

    const toCapitalize = (s: string): string => s[0].toUpperCase() + s.substring(1);
</script>

<Sheet.Root {closeFocus}>
    <Sheet.Trigger asChild let:builder>
        <Button builders={[builder]} variant="outline">
            <Icon icon="material-symbols:settings" class="w-6 h-6"/>
        </Button>
    </Sheet.Trigger>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>DHL Configuration</Sheet.Title>
            <Sheet.Description>
                DHL specific options such as modifying HU code used for containerization.
            </Sheet.Description>
        </Sheet.Header>
        <div class="grid grid-cols-4 items-center gap-4 my-4">
            <Label for="hu-code" class="text-right">HU Code</Label>
            <Input id="hu-code" type="text" bind:value={$huCode} class="col-span-3" />
        </div>
        <Sheet.Header >
            <Sheet.Title>Site Settings</Sheet.Title>
            <Sheet.Description>
                Settings for API server and general site customization options.
            </Sheet.Description>
        </Sheet.Header>
        <div class="grid grid-cols-4 items-center gap-4 mt-4 mb-6">
            <Label for="server" class="text-right">Server Url</Label>
            <Input value={serverURL} id="server" class="col-span-3" disabled/>
            <Label for="theme" class="text-right">Theme</Label>
            <Select.Root>
                <Select.Trigger class="col-span-3">
                    {#if $mode !== undefined}
                        <Select.Value placeholder={toCapitalize($mode)} />
                    {/if}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="light" on:click={() => setMode("light")}>Light</Select.Item>
                    <Select.Item value="dark" on:click={() => setMode("dark")}>Dark</Select.Item>
                    <Select.Item value="system" on:click={() => resetMode()}>System</Select.Item>
                </Select.Content>
            </Select.Root>
        </div>
        <div class="grid grid-cols-2 items-center gap-4 mt-8">
            <Sheet.Close asChild let:builder>
                <Button builders={[builder]} type="button" on:click={saveSettings}>Sync changes</Button>
            </Sheet.Close>
            <Button variant="destructive" on:click={() => openDialog = true}>Delete History</Button>
            <AlertDialog.Root bind:open={openDialog}>
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                        <AlertDialog.Description>
                            This action cannot be undone. This will permanently delete your shipment history from our database
                        </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action on:click={deleteHistory}>Continue</AlertDialog.Action>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </div>
    </Sheet.Content>
</Sheet.Root>