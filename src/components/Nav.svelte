<script lang="ts">
    import type { FocusProp } from "bits-ui";
    import DHL from "./icons/DHL.svelte";
    import Settings from "./Settings.svelte";

    export let focusElement: FocusProp | undefined = undefined;
</script>

<header class="sticky top-0 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1 mb-8 z-50">
    <nav class="container flex items-center justify-between">
        <a href="#top" title="Logo">
            <DHL class="w-[6rem]"/>
        </a>
        <Settings closeFocus={focusElement}/>
    </nav>
</header>