import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {LotStore} from "./model";
import {Lot} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";

export const LotStoreProxy = proxy<LotStore>({
    LotEdit: {} as Lot,
    Lotlist: [],
    LotFilter: {} as Lot,
    LottableUrl: "",
});

export const useproxy_LotEdit = () => {
    var LotlistStore = useProxy(LotStoreProxy);
    console.info("调用useLotlistRows,返回Rows列表:", LotlistStore.LotEdit);
    return LotlistStore.LotEdit;
};
export const useproxy_LotFilter = () => {
    var LotlistStore = useProxy(LotStoreProxy);
    console.info("调用useLotlistRows,返回Rows列表:", LotlistStore.LotFilter);
    return LotlistStore.LotFilter;
};
export const useproxy_LottableUrl = () => {
    var LotlistStore = useProxy(LotStoreProxy);
    console.info("调用useLotlistRows,返回Rows列表:", LotlistStore.LottableUrl);
    return LotlistStore.LottableUrl;
};
export const initialLotParams: Lot = {
    id: "",
    distributorId: "",
};
export const pre_LotlistLoader = async () => {
    var permissions = authProxy.permissions;
    var LotTable = permissions.find((option) => option.name === "批次管理");
    LotStoreProxy.LottableUrl = `${LotTable?.url}/${LotTable?.id}`;
    return true;
};
