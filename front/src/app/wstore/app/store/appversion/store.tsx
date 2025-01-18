import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {AppVersionStore} from "./model";
import {AppVersion} from "../../../../../api/ws/v1/wm_pb";

export const AppsverdetailStoreProxy = proxy<AppVersionStore>({
    AppVersionEdit: {} as AppVersion,
    AppVersionList: [] as AppVersion[],
    IsAppsFileUpload: false,
    AppsversiontableUrl: "",
    classX: "",
});

export const useproxy_AppVersionEdit = () => {
    var AppsversionlistStore = useProxy(AppsverdetailStoreProxy);
    console.info(
        "调用useAppsversionlistRows,返回Rows列表:",
        AppsversionlistStore.AppVersionEdit,
    );
    return AppsversionlistStore.AppVersionEdit;
};

export const useproxy_AppsversiontableUrl = () => {
    var AppsversionlistStore = useProxy(AppsverdetailStoreProxy);
    console.info(
        "调用useAppsversionlistRows,返回Rows列表:",
        AppsversionlistStore.AppVersionEdit,
    );
    return AppsversionlistStore.AppsversiontableUrl;
};
export const useproxy_ClassX = () => {
    var AppsversionlistStore = useProxy(AppsverdetailStoreProxy);
    console.info(
        "调用useAppsversionlistRows,返回Rows列表:",
        AppsversionlistStore.classX,
    );
    return AppsversionlistStore.classX;
};
export const initialAppVersionParams = {
    name: "",
};
