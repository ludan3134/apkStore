import {Vod} from "../../../../../api/ks/v1/km_pb";

export type VodStore = {
    VodEdit: Vod;
    Vodlist: Vod[];
    VodFilter: Vod;
    VodtableUrl: string;
};
