import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ApkStore} from "./model";
import {Apk} from "../../../../../../api/tv_fs/v1/fm_pb";
import {authProxy} from "../../../../../auth/store/store";

export const ApkStoreProxy = proxy<ApkStore>({
    ApkEdit: {} as Apk,
    Apklist: [],
    ApkFilter: {} as Apk,
    ApktableUrl: "",
});

export const useproxy_ApkEdit = () => {
    var ApklistStore = useProxy(ApkStoreProxy);
    console.info("调用useApklistRows,返回Rows列表:", ApklistStore.ApkEdit);
    return ApklistStore.ApkEdit;
};
export const useproxy_ApkFilter = () => {
    var ApklistStore = useProxy(ApkStoreProxy);
    console.info("调用useApklistRows,返回Rows列表:", ApklistStore.ApkFilter);
    return ApklistStore.ApkFilter;
};
export const useproxy_ApktableUrl = () => {
    var ApklistStore = useProxy(ApkStoreProxy);
    console.info("调用useApklistRows,返回Rows列表:", ApklistStore.ApktableUrl);
    return ApklistStore.ApktableUrl;
};
export const initialApkParams: Apk = {};
export const pre_ApklistLoader = async () => {
    var permissions = authProxy.permissions;
    var ApkTable = permissions.find(
        (option) => option.name === "查看Apk管理下级页面",
    );
    ApkStoreProxy.ApktableUrl = `${ApkTable?.url}/${ApkTable?.id}`;
    return true;
};

export const pre_ApkLoader = async () => {
    var permissions = authProxy.permissions;
    var AdvertisementPictureTable = permissions.find(
        (option) => option.name === "查看电视消息通知下级页面",
    );
    ApkStoreProxy.ApktableUrl = `${AdvertisementPictureTable?.url}/${AdvertisementPictureTable?.id}`;
    return true;
};
