import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {AccountStore} from "./model";
import {AccountFilter, AccountInfo, LotLabel,} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcDistributorLot} from "../../../../const/distributor2lot/grpcDistributor2lot";

export const AccountStoreProxy = proxy<AccountStore>({
    AccountEdit: {} as AccountInfo,
    Accountlist: [],
    AccountFilter: {} as AccountFilter,
    AccounttableUrl: "",
    lotList: [] as LotLabel[],
});

export const useproxy_AccountEdit = () => {
    var AccountlistStore = useProxy(AccountStoreProxy);
    console.info(
        "调用useAccountlistRows,返回Rows列表:",
        AccountlistStore.AccountEdit,
    );
    return AccountlistStore.AccountEdit;
};
export const useproxy_AccountFilter = () => {
    var AccountlistStore = useProxy(AccountStoreProxy);
    console.info(
        "调用useAccountlistRows,返回Rows列表:",
        AccountlistStore.AccountFilter,
    );
    return AccountlistStore.AccountFilter;
};
export const useproxy_AccounttableUrl = () => {
    var AccountlistStore = useProxy(AccountStoreProxy);
    console.info(
        "调用useAccountlistRows,返回Rows列表:",
        AccountlistStore.AccounttableUrl,
    );
    return AccountlistStore.AccounttableUrl;
};
export const useproxy_Lotlist = () => {
    var AccountlistStore = useProxy(AccountStoreProxy);
    console.info(
        "调用useAccountlistRows,返回Rows列表:",
        AccountlistStore.AccounttableUrl,
    );
    return AccountlistStore.lotList;
};
export const initialAccountParams: AccountInfo = {
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
export const initialAccountfilterParams: AccountFilter = {
    distributorId: "",
    lotId: "",
    macString: "",
    apkType: "",
    isActive: "",
    isService: "",
    isExpired: "",
};
export const pre_AccountlistLoader = async () => {
    var permissions = authProxy.permissions;
    var AccountTable = permissions.find(
        (option) => option.name === "查看终端用户",
    );
    AccountStoreProxy.AccounttableUrl = `${AccountTable?.url}/${AccountTable?.id}`;
    AccountStoreProxy.AccountFilter = {} as AccountFilter

    grpcDistributorLot();
    return true;
};
