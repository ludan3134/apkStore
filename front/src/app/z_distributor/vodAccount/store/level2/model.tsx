import {Vod, VodClassLabel} from "../../../../../api/ks/v1/km_pb";
import {CategoryLabel} from "../../../../../api/ta/v1/tam_pb";

export type VodStore = {
    VodEdit: Vod;
    Vodlist: Vod[];
    VodFilter: Vod;
    VodtableUrl: string[];
    AllOption: VodClassLabel[];
    AllCategory: CategoryLabel[];
};
