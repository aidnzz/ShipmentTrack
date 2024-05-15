export type ShipmentType = {
    pieces: number
    count: number
};

export type ShipmentsType = {
    [waybill:number]: ShipmentType
};