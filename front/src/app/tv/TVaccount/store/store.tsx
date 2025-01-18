import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVAccountStore} from "./model";
import {AccountFilter, AccountInfo, LotLabel,} from "../../../../api/tv_asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcTVDistributorLot} from "../../../../const/distributor2lot/tv/grpcDistributor2lot";

export const TVAccountStoreProxy = proxy<TVAccountStore>({
    TVAccountEdit: {} as AccountInfo,
    TVAccountlist: [],
    TVAccountFilter: {} as AccountFilter,
    TVAccounttableUrl: "",
    lotList: [] as LotLabel[],
});

export const useproxy_TVAccountEdit = () => {
    var AccountlistStore = useProxy(TVAccountStoreProxy);
    console.info(
        "调用useAccountlistRows,返回Rows列表:",
        AccountlistStore.TVAccountEdit,
    );
    return AccountlistStore.TVAccountEdit;
};
export const useproxy_TVAccountFilter = () => {
    var AccountlistStore = useProxy(TVAccountStoreProxy);
    console.info(
        "调用useAccountlistRows,返回Rows列表:",
        AccountlistStore.TVAccountFilter,
    );
    return AccountlistStore.TVAccountFilter;
};
export const useproxy_TVAccounttableUrl = () => {
    var AccountlistStore = useProxy(TVAccountStoreProxy);
    console.info(
        "调用useAccountlistRows,返回Rows列表:",
        AccountlistStore.TVAccounttableUrl,
    );
    return AccountlistStore.TVAccounttableUrl;
};
export const useproxy_Lotlist = () => {
    var AccountlistStore = useProxy(TVAccountStoreProxy);
    console.info(
        "调用useAccountlistRows,返回Rows列表:",
        AccountlistStore.TVAccounttableUrl,
    );
    return AccountlistStore.lotList;
};
export const initialTVAccountParams: AccountInfo = {
    id: "",
    distributorId: "",
    lotId: "",
    boxId: "",
    stbId: "",
    macString: "",
    chipIdentity: "",
    apkType: "",
    isActive: false,
    isService: false,
    registerDate: "",
    activeDateStart: "",
    activeDays: 0,
    isExpired: false,
    createAt: "",
    updatedAt: "",
    isDeleted: false,
    distributorName: "",
};
export const initialTVAccountfilterParams: AccountFilter = {
    distributorId: "",
    lotId: "",
    macString: "",
    apkType: "",
    isActive: "",
    isService: "",
    isExpired: "",
};
export const pre_TVAccountlistLoader = async () => {
    var permissions = authProxy.permissions;
    var AccountTable = permissions.find(
        (option) => option.name === "查看电视终端用户",
    );
    TVAccountStoreProxy.TVAccountFilter = {} as AccountFilter
    TVAccountStoreProxy.TVAccounttableUrl = `${AccountTable?.url}/${AccountTable?.id}`;
    grpcTVDistributorLot();
    return true;
};
