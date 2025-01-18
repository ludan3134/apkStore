import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VodClassStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {VodClass} from "../../../../../api/ks/v1/km_pb";

export const VodClassStoreProxy = proxy<VodClassStore>({
    VodClassEdit: {} as VodClass,
    VodClasslist: [],
    VodClassFilter: {} as VodClass,
    VodClasstableUrl: "",
});

export const useproxy_VodClassEdit = () => {
    var VodClasslistStore = useProxy(VodClassStoreProxy);
    console.info(
        "调用useVodClasslistRows,返回Rows列表:",
        VodClasslistStore.VodClassEdit,
    );
    return VodClasslistStore.VodClassEdit;
};
export const useproxy_VodClassFilter = () => {
    var VodClasslistStore = useProxy(VodClassStoreProxy);
    console.info(
        "调用useVodClasslistRows,返回Rows列表:",
        VodClasslistStore.VodClassFilter,
    );
    return VodClasslistStore.VodClassFilter;
};
export const useproxy_VodClasstableUrl = () => {
    var VodClasslistStore = useProxy(VodClassStoreProxy);
    console.info(
        "调用useVodClasslistRows,返回Rows列表:",
        VodClasslistStore.VodClasstableUrl,
    );
    return VodClasslistStore.VodClasstableUrl;
};

export const initialVodClassParams: VodClass = {};
export const pre_VodClasslistLoader = async () => {
    var permissions = authProxy.permissions;
    var VodClassTable = permissions.find(
        (option) => option.name === "查看点播一级分类",
    );
    VodClassStoreProxy.VodClasstableUrl = `${VodClassTable?.url}/${VodClassTable?.id}`;
    return true;
};
