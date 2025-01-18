import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVLotStore} from "./model";
import {Lot} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";

export const TVLotStoreProxy = proxy<TVLotStore>({
    TVLotEdit: {} as Lot,
    TVLotlist: [],
    TVLotFilter: {} as Lot,
    TVLottableUrl: "",
});

export const useproxy_TVLotEdit = () => {
    var TVLotlistStore = useProxy(TVLotStoreProxy);
    console.info("调用useTVLotlistRows,返回Rows列表:", TVLotlistStore.TVLotEdit);
    return TVLotlistStore.TVLotEdit;
};
export const useproxy_TVLotFilter = () => {
    var TVLotlistStore = useProxy(TVLotStoreProxy);
    console.info(
        "调用useTVLotlistRows,返回Rows列表:",
        TVLotlistStore.TVLotFilter,
    );
    return TVLotlistStore.TVLotFilter;
};
export const useproxy_TVLottableUrl = () => {
    var TVLotlistStore = useProxy(TVLotStoreProxy);
    console.info(
        "调用useTVLotlistRows,返回Rows列表:",
        TVLotlistStore.TVLottableUrl,
    );
    return TVLotlistStore.TVLottableUrl;
};
export const initialTVLotPartv_tv_asm: Lot = {
    id: "",
    distributorId: "",
};
export const pre_TVLotlistLoader = async () => {
    var permissions = authProxy.permissions;
    var TVLotTable = permissions.find((option) => option.name === "查看电视批次");
    TVLotStoreProxy.TVLottableUrl = `${TVLotTable?.url}/${TVLotTable?.id}`;
    return true;
};
