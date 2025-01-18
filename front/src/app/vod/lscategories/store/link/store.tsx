import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VodLinkCalssStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {VodLink} from "../../../../../api/ks/v1/km_pb";

export const VodLinkCalssStoreProxy = proxy<VodLinkCalssStore>({
    VodLinkCalssEdit: {} as VodLink,
    VodLinkCalsslist: [],
    VodLinkCalssFilter: {} as VodLink,
    VodLinkCalsstableUrl: "",
});

export const useproxy_VodLinkCalssEdit = () => {
    var VodLinkCalsslistStore = useProxy(VodLinkCalssStoreProxy);
    console.info(
        "调用useVodLinkCalsslistRows,返回Rows列表:",
        VodLinkCalsslistStore.VodLinkCalssEdit,
    );
    return VodLinkCalsslistStore.VodLinkCalssEdit;
};
export const useproxy_VodLinkCalssFilter = () => {
    var VodLinkCalsslistStore = useProxy(VodLinkCalssStoreProxy);
    console.info(
        "调用useVodLinkCalsslistRows,返回Rows列表:",
        VodLinkCalsslistStore.VodLinkCalssFilter,
    );
    return VodLinkCalsslistStore.VodLinkCalssFilter;
};
export const useproxy_VodLinkCalsstableUrl = () => {
    var VodLinkCalsslistStore = useProxy(VodLinkCalssStoreProxy);
    console.info(
        "调用useVodLinkCalsslistRows,返回Rows列表:",
        VodLinkCalsslistStore.VodLinkCalsstableUrl,
    );
    return VodLinkCalsslistStore.VodLinkCalsstableUrl;
};
export const initialVodLinkCalssParams: VodLink = {
    id: 0,
    channelId: 0,
    VodLink: "",
    source: "",
    sort: 0,
    isUse: false,
    scriptDeal: false,
    method: "",
    decode: 0,
    mainClassId: 0,
    subClassId: 0,
    keyword: "",
};
export const pre_VodLinkCalsslistLoader = async () => {
    var permissions = authProxy.permissions;
    var VodLinkCalssTable = permissions.find(
        (option) => option.name === "查看三级分类",
    );
    VodLinkCalssStoreProxy.VodLinkCalsstableUrl = `${VodLinkCalssTable?.url}/${VodLinkCalssTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
