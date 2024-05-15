import { writable } from "svelte/store";
import type { ShipmentsType } from  "./types/shipment.type";

import { db } from "./firebase";
import { onValue, ref, child } from "firebase/database";

type Shipments = {
    present: ShipmentsType
    history: ShipmentsType
};

export const shipments = writable<Shipments>({
    present: {},
    history: {}
});

onValue(child(ref(db), "present"), (snapshot) => {
    const present = snapshot.val() || {};
    shipments.update(({history}) => { return {present, history} });
})

onValue(child(ref(db), "history"), (snapshot) => {
    const history = snapshot.val() || {};
    shipments.update(({present}) => { return {history, present} });
})

export const huCode = writable<string | null>(null);

onValue(child(ref(db), "code"), (snapshot) => {
    huCode.set(snapshot.val());
})