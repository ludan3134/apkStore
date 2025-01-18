import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {AppBannerStore} from "./model";
import {authProxy} from "../../../../../auth/store/store";
import {AppBanner} from "../../../../../../api/fs/v1/fm_pb";

export const AppBannerStoreProxy = proxy<AppBannerStore>({
    AppBannerEdit: {} as AppBanner,
    AppBannerlist: [],
    AppBannerFilter: {} as AppBanner,
    AppBannertableUrl: "",
});

export const useproxy_AppBannerEdit = () => {
    var AppBannerlistStore = useProxy(AppBannerStoreProxy);
    console.info(
        "调用useAppBannerlistRows,返回Rows列表:",
        AppBannerlistStore.AppBannerEdit,
    );
    return AppBannerlistStore.AppBannerEdit;
};
export const useproxy_AppBannerFilter = () => {
    var AppBannerlistStore = useProxy(AppBannerStoreProxy);
    console.info(
        "调用useAppBannerlistRows,返回Rows列表:",
        AppBannerlistStore.AppBannerFilter,
    );
    return AppBannerlistStore.AppBannerFilter;
};
export const useproxy_AppBannertableUrl = () => {
    var AppBannerlistStore = useProxy(AppBannerStoreProxy);
    console.info(
        "调用useAppBannerlistRows,返回Rows列表:",
        AppBannerlistStore.AppBannertableUrl,
    );
    return AppBannerlistStore.AppBannertableUrl;
};
export const initialAppBannerParams: AppBanner = {};
export const pre_OTTAppBannerlistLoader = async () => {
    var permissions = authProxy.permissions;
    var AppBannerTable = permissions.find(
        (option) => option.name === "查看盒子市场图片管理下级页面",
    );
    AppBannerStoreProxy.AppBannertableUrl = `${AppBannerTable?.url}/${AppBannerTable?.id}`;
    return true;
};

