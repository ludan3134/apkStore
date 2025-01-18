import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {VodRepeatedStore} from "./model";
import {VodRepeated} from "../../../../api/ks/v1/km_pb";

export const VodRepeatedStoreproxy = proxy<VodRepeatedStore>({
    VodRepeatedEdit: {} as VodRepeated,
    VodRepeatedlist: [],
    VodRepeatedFilter: {} as VodRepeated,
    VodRepeatedtableUrl: "",
});

export const useproxy_VodRepeatedEdit = () => {
    var VodRepeatedStore = useProxy(VodRepeatedStoreproxy);
    console.info(
        "调用useVodRepeatedRows,返回Rows列表:",
        VodRepeatedStore.VodRepeatedEdit,
    );
    return VodRepeatedStore.VodRepeatedEdit;
};
export const useproxy_VodRepeatedFilter = () => {
    var VodRepeatedStore = useProxy(VodRepeatedStoreproxy);
    console.info(
        "调用useVodRepeatedRows,返回Rows列表:",
        VodRepeatedStore.VodRepeatedFilter,
    );
    return VodRepeatedStore.VodRepeatedFilter;
};
export const useproxy_VodRepeatedUrl = () => {
    var VodRepeatedStore = useProxy(VodRepeatedStoreproxy);
    console.info(
        "调用useVodRepeatedRows,返回Rows列表:",
        VodRepeatedStore.VodRepeatedtableUrl,
    );
    return VodRepeatedStore.VodRepeatedtableUrl;
};
export const initialVodRepeatedParams: VodRepeated = {
    id: 0,
    name: "",
    category: "",
    vodType: 0,
    repeatedCount: 0,
};

export const pre_VodRepeatedLoader = async () => {
    var permissions = authProxy.permissions;
    var VodRepeatedTable = permissions.find(
        (option) => option.name === "查看重复影片",
    );
    VodRepeatedStoreproxy.VodRepeatedtableUrl = `${VodRepeatedTable?.url}/${VodRepeatedTable?.id}`;
    return true;
};
