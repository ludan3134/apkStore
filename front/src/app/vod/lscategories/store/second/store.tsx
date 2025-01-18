import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VodStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {Vod} from "../../../../../api/ks/v1/km_pb";

export const VodStoreProxy = proxy<VodStore>({
    VodEdit: {} as Vod,
    Vodlist: [],
    VodFilter: {} as Vod,
    VodtableUrl: "",
});

export const useproxy_VodEdit = () => {
    var VodlistStore = useProxy(VodStoreProxy);
    console.info("调用useVodlistRows,返回Rows列表:", VodlistStore.VodEdit);
    return VodlistStore.VodEdit;
};
export const useproxy_VodFilter = () => {
    var VodlistStore = useProxy(VodStoreProxy);
    console.info("调用useVodlistRows,返回Rows列表:", VodlistStore.VodFilter);
    return VodlistStore.VodFilter;
};
export const useproxy_VodtableUrl = () => {
    var VodlistStore = useProxy(VodStoreProxy);
    console.info("调用useVodlistRows,返回Rows列表:", VodlistStore.VodtableUrl);
    return VodlistStore.VodtableUrl;
};

export const initialVodParams: Vod = {};
export const pre_VodlistLoader = async () => {
    var permissions = authProxy.permissions;
    var VodTable = permissions.find((option) => option.name === "查看二级分类");
    VodStoreProxy.VodtableUrl = `${VodTable?.url}/${VodTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
