<script lang="ts">
    import Nav from "../components/Nav.svelte";
    import Shipments from "../components/Shipments.svelte";

    let shipmentInput: HTMLElement;
</script>

<Nav focusElement={() => shipmentInput}/>

<main class="container">
    <Shipments bind:shipmentInput/>
</main>