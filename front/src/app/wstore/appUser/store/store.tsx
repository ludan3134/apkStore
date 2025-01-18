import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {AppUserStore} from "./model";
import {AppUser} from "../../../../api/ws/v1/wm_pb";

export const AppUserStoreProxy = proxy<AppUserStore>({
    AppUserEdit: {} as AppUser,
    AppUserList: [] as AppUser[],
    AppUserUrl: "",
    AppUserFilter: {} as AppUser,
});

export const useproxy_AppUserEdit = () => {
    var AppUserlistStore = useProxy(AppUserStoreProxy);
    console.info(
        "调用useAppUserlistRows,返回Rows列表:",
        AppUserlistStore.AppUserEdit,
    );
    return AppUserlistStore.AppUserEdit;
};
export const useproxy_AppUserFilter = () => {
    var AppUserlistStore = useProxy(AppUserStoreProxy);
    console.info(
        "调用useAppUserlistRows,返回Rows列表:",
        AppUserlistStore.AppUserFilter,
    );
    return AppUserlistStore.AppUserFilter;
};
export const useproxy_AppUsertableUrl = () => {
    var AppUserlistStore = useProxy(AppUserStoreProxy);
    console.info(
        "调用useAppUserlistRows,返回Rows列表:",
        AppUserlistStore.AppUserUrl,
    );
    return AppUserlistStore.AppUserUrl;
};

export const pre_AppUserlistLoader = async () => {
    return true;
};

export const initialAppUserfilterParams: AppUser = {
    userName: "",
    password: "",
    mac: "",
    ip: "",
    country: "",
    city: "",
    distributorId: "",
    modelId: "",
    distributorName: "",
    modelName: "",
    lastLogin: "",
    operator: "",
};
export const pre_AppsUserlistLoader = async () => {
    AppUserStoreProxy.AppUserFilter = {} as AppUser;
    return true;
};
