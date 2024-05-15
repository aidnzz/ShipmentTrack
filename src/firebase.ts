import { initializeApp } from "firebase/app";
import { child, getDatabase, ref, set, get, remove, increment, update } from "firebase/database";

import type { ShipmentType } from "./types/shipment.type";
import { firebaseConfig } from "./config";

// Initialise firebase
const app = initializeApp(firebaseConfig);

// Initialise real time dataase
export const db = getDatabase(app);

export function addShipment(waybill: number, shipment: ShipmentType): void {
    const presentRef = ref(db, "present");
    const shipmentRef = child(presentRef, waybill.toString());
    set(shipmentRef, shipment);
}

// Add shipment to history
export function deleteShipment(waybill: number, addToHistory: boolean = true): void {
    const present = ref(db, "present");
    const shipmentRef = child(present, waybill.toString());

    if (addToHistory) {
        get(shipmentRef).then(snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log(`Adding: ${waybill} => ${data} to history`);
                
                const historyRef = ref(db, "history");
                // Add data to history
                set(child(historyRef, waybill.toString()), data);
            }
        });
    }

    // Remove shipment
    remove(shipmentRef);
}

// Take shipment from history and move to present
export function restoreShipment(waybill: number): void {
    const historyRef = ref(db, "history");
    const shipmentRef = child(historyRef, waybill.toString());

    get(shipmentRef).then(snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const presentRef = ref(db, "present");
            // Add data to base to working list
            set(child(presentRef, waybill.toString()), data);
        }
    });

    // Remove shipment from history
    remove(shipmentRef);
}

export function clearHistory(): void {
    const historyRef = ref(db, "history");
    remove(historyRef);
}

export function incrementShipment(waybill: number): void {
    const presentRef = ref(db, "present");
    
    const updates = {
        count: increment(1)
    };

    update(child(presentRef, waybill.toString()), updates);
}

export function changeHUCode(hu: string | null): void {
    if (hu !== null) {
        const codeRef = ref(db, "code");
        set(codeRef, hu);
    }
}