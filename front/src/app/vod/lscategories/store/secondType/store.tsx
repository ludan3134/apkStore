import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VodTypeStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {VodType} from "../../../../../api/ks/v1/km_pb";

export const VodTypeStoreProxy = proxy<VodTypeStore>({
    VodTypeEdit: {} as VodType,
    VodTypelist: [],
    VodTypeFilter: {} as VodType,
    VodTypetableUrl: "",
});

export const useproxy_VodTypeEdit = () => {
    var VodTypelistStore = useProxy(VodTypeStoreProxy);
    console.info("调用useVodTypelistRows,返回Rows列表:", VodTypelistStore.VodTypeEdit);
    return VodTypelistStore.VodTypeEdit;
};
export const useproxy_VodTypeFilter = () => {
    var VodTypelistStore = useProxy(VodTypeStoreProxy);
    console.info("调用useVodTypelistRows,返回Rows列表:", VodTypelistStore.VodTypeFilter);
    return VodTypelistStore.VodTypeFilter;
};
export const useproxy_VodTypetableUrl = () => {
    var VodTypelistStore = useProxy(VodTypeStoreProxy);
    console.info("调用useVodTypelistRows,返回Rows列表:", VodTypelistStore.VodTypetableUrl);
    return VodTypelistStore.VodTypetableUrl;
};

export const initialVodTypeParams: VodType = {};
export const pre_VodTypelistLoader = async () => {
    var permissions = authProxy.permissions;
    var VodTypeTable = permissions.find((option) => option.name === "查看点播子类别");
    VodTypeStoreProxy.VodTypetableUrl = `${VodTypeTable?.url}/${VodTypeTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
