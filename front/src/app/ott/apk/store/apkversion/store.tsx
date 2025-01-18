import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ApkdetailStore} from "./model";
import {ApkDetail} from "../../../../../api/fs/v1/fm_pb";

export const ApkverdetailStoreProxy = proxy<ApkdetailStore>({
    ApkdetailEdit: {} as ApkDetail,
    ApkdetailList: [] as ApkDetail[],
    IsApkFileUpload: false,
    ApkversiontableUrl: "",
});

export const useproxy_ApkdetailEdit = () => {
    var ApkversionlistStore = useProxy(ApkverdetailStoreProxy);
    console.info(
        "调用useApkversionlistRows,返回Rows列表:",
        ApkversionlistStore.ApkdetailEdit,
    );
    return ApkversionlistStore.ApkdetailEdit;
};

export const useproxy_ApkversiontableUrl = () => {
    var ApkversionlistStore = useProxy(ApkverdetailStoreProxy);
    console.info(
        "调用useApkversionlistRows,返回Rows列表:",
        ApkversionlistStore.ApkdetailEdit,
    );
    return ApkversionlistStore.ApkversiontableUrl;
};
export const initialApkdetailParams = {
    name: "",
};
