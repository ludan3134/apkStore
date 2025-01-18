import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VodTypeItemStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {VodTypeItem} from "../../../../../api/ks/v1/km_pb";

export const VodTypeItemStoreProxy = proxy<VodTypeItemStore>({
    VodTypeItemEdit: {} as VodTypeItem,
    VodTypeItemlist: [],
    VodTypeItemFilter: {} as VodTypeItem,
    VodTypeItemtableUrl: "",
});

export const useproxy_VodTypeItemEdit = () => {
    var VodTypeItemlistStore = useProxy(VodTypeItemStoreProxy);
    console.info(
        "调用useVodTypeItemlistRows,返回Rows列表:",
        VodTypeItemlistStore.VodTypeItemEdit,
    );
    return VodTypeItemlistStore.VodTypeItemEdit;
};
export const useproxy_VodTypeItemFilter = () => {
    var VodTypeItemlistStore = useProxy(VodTypeItemStoreProxy);
    console.info(
        "调用useVodTypeItemlistRows,返回Rows列表:",
        VodTypeItemlistStore.VodTypeItemFilter,
    );
    return VodTypeItemlistStore.VodTypeItemFilter;
};
export const useproxy_VodTypeItemtableUrl = () => {
    var VodTypeItemlistStore = useProxy(VodTypeItemStoreProxy);
    console.info(
        "调用useVodTypeItemlistRows,返回Rows列表:",
        VodTypeItemlistStore.VodTypeItemtableUrl,
    );
    return VodTypeItemlistStore.VodTypeItemtableUrl;
};
export const initialVodTypeItemParams: VodTypeItem = {};
export const pre_VodTypeItemlistLoader = async () => {
    var permissions = authProxy.permissions;
    var VodTypeItemTable = permissions.find(
        (option) => option.name === "查看点播子类别选项",
    );
    VodTypeItemStoreProxy.VodTypeItemtableUrl = `${VodTypeItemTable?.url}/${VodTypeItemTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
