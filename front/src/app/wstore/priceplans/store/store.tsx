import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {PricePlans} from "../../../../api/ws/v1/wm_pb";
import {PricePlansStore} from "./model";

export const PricePlansStoreProxy = proxy<PricePlansStore>({
    PricePlansEdit: {} as PricePlans,
    PricePlansList: [] as PricePlans[],
    PricePlansUrl: "",
    PricePlansFilter: {} as PricePlans,
});

export const useproxy_PricePlansEdit = () => {
    var PricePlanslistStore = useProxy(PricePlansStoreProxy);
    console.info(
        "调用usePricePlanslistRows,返回Rows列表:",
        PricePlanslistStore.PricePlansEdit,
    );
    return PricePlanslistStore.PricePlansEdit;
};

export const useproxy_PricePlanstableUrl = () => {
    var PricePlanslistStore = useProxy(PricePlansStoreProxy);
    console.info(
        "调用usePricePlanslistRows,返回Rows列表:",
        PricePlanslistStore.PricePlansUrl,
    );
    return PricePlanslistStore.PricePlansUrl;
};

export const pre_PricePlanslistLoader = async () => {
    return true;
};

export const initialPricePlansfilterParams: PricePlans = {
    id: 0,
    planName: "",
    planDescription: "",
    billingCycle: "",
    trialPeriod: "",
    price: 0,
    deleted: false,
};
