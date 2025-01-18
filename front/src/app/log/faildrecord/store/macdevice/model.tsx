import {MacDevice} from "../../../../../api/ax/v1/axm_pb";

export type MacDeviceStore = {
    MacDeviceEdit: MacDevice;
    MacDevicelist: [];
    MacDeviceFilter: MacDevice;
    MacDevicetableUrl: string;
};


export type MacDeviceBulkImport = {
    distributor_id: string;
    lot_id: string;
    set_active: boolean;
    set_service: boolean;
};

