import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVFirewaredetailStore} from "./model";
import {FirmwareDetail} from "../../../../../api/fs/v1/fm_pb";

export const TVFirewareverdetailStoreProxy = proxy<TVFirewaredetailStore>({
    TVFirewaredetailEdit: {} as FirmwareDetail,
    TVFirewaredetailList: [] as FirmwareDetail[],
    IsTVFirewareFileUpload: false,
    TVFirewareversiontableUrl: "",
});

export const useproxy_TVFirewaredetailEdit = () => {
    var TVFirewareversionlistStore = useProxy(TVFirewareverdetailStoreProxy);
    console.info(
        "调用useTVFirewareversionlistRows,返回Rows列表:",
        TVFirewareversionlistStore.TVFirewaredetailEdit,
    );
    return TVFirewareversionlistStore.TVFirewaredetailEdit;
};

export const useproxy_TVFirewareversiontableUrl = () => {
    var TVFirewareversionlistStore = useProxy(TVFirewareverdetailStoreProxy);
    console.info(
        "调用useTVFirewareversionlistRows,返回Rows列表:",
        TVFirewareversionlistStore.TVFirewaredetailEdit,
    );
    return TVFirewareversionlistStore.TVFirewareversiontableUrl;
};
export const initialTVFirewaredetailParams = {
    name: "",
};
