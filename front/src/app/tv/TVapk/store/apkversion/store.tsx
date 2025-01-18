import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVApkdetailStore} from "./model";
import {ApkDetail} from "../../../../../api/fs/v1/fm_pb";

export const TVApkverdetailStoreProxy = proxy<TVApkdetailStore>({
    TVApkdetailEdit: {} as ApkDetail,
    TVApkdetailList: [] as ApkDetail[],
    IsTVApkFileUpload: false,
    TVApkversiontableUrl: "",
});

export const useproxy_TVApkdetailEdit = () => {
    var TVApkversionlistStore = useProxy(TVApkverdetailStoreProxy);
    console.info(
        "调用useTVApkversionlistRows,返回Rows列表:",
        TVApkversionlistStore.TVApkdetailEdit,
    );
    return TVApkversionlistStore.TVApkdetailEdit;
};

export const useproxy_TVApkversiontableUrl = () => {
    var TVApkversionlistStore = useProxy(TVApkverdetailStoreProxy);
    console.info(
        "调用useTVApkversionlistRows,返回Rows列表:",
        TVApkversionlistStore.TVApkdetailEdit,
    );
    return TVApkversionlistStore.TVApkversiontableUrl;
};
export const initialTVApkdetailParams = {
    name: "",
};
