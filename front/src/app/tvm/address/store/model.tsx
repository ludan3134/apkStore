import {AddressConfig} from "../../../../api/ks/v1/km_pb";

export type AddressStore = {
    AddressEdit: AddressConfig;
    Addresslist: AddressConfig[];
    AddressFilter: AddressConfig;
    AddresstableUrl: string;
};
