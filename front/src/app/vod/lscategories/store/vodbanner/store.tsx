import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VodBannerStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {VodBanner} from "../../../../../api/ks/v1/km_pb";

export const VodBannerStoreProxy = proxy<VodBannerStore>({
    VodBannerEdit: {} as VodBanner,
    VodBannerlist: [],
    VodBannerFilter: {} as VodBanner,
    VodBannertableUrl: "",
});

export const useproxy_VodBannerEdit = () => {
    var VodBannerlistStore = useProxy(VodBannerStoreProxy);
    console.info(
        "调用useVodBannerlistRows,返回Rows列表:",
        VodBannerlistStore.VodBannerEdit,
    );
    return VodBannerlistStore.VodBannerEdit;
};
export const useproxy_VodBannerFilter = () => {
    var VodBannerlistStore = useProxy(VodBannerStoreProxy);
    console.info(
        "调用useVodBannerlistRows,返回Rows列表:",
        VodBannerlistStore.VodBannerFilter,
    );
    return VodBannerlistStore.VodBannerFilter;
};
export const useproxy_VodBannertableUrl = () => {
    var VodBannerlistStore = useProxy(VodBannerStoreProxy);
    console.info(
        "调用useVodBannerlistRows,返回Rows列表:",
        VodBannerlistStore.VodBannertableUrl,
    );
    return VodBannerlistStore.VodBannertableUrl;
};

export const initialVodBannerParams: VodBanner = {};
export const pre_VodBannerlistLoader = async () => {
    var permissions = authProxy.permissions;
    var VodBannerTable = permissions.find(
        (option) => option.name === "查看点播一级分类",
    );
    VodBannerStoreProxy.VodBannertableUrl = `${VodBannerTable?.url}/${VodBannerTable?.id}`;
    return true;
};
