import {PricePlans} from "../../../../api/ws/v1/wm_pb";

export type PricePlansStore = {
    PricePlansEdit: PricePlans;
    PricePlansList: PricePlans[];
    PricePlansUrl: string;
    PricePlansFilter: PricePlans;
};
