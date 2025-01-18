import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {FirewaredetailStore} from "./model";
import {FirmwareDetail} from "../../../../../api/fs/v1/fm_pb";

export const FirewareverdetailStoreProxy = proxy<FirewaredetailStore>({
    FirewaredetailEdit: {} as FirmwareDetail,
    FirewaredetailList: [] as FirmwareDetail[],
    IsFirewareFileUpload: false,
    FirewareversiontableUrl: "",
});

export const useproxy_FirewaredetailEdit = () => {
    var FirewareversionlistStore = useProxy(FirewareverdetailStoreProxy);
    console.info(
        "调用useFirewareversionlistRows,返回Rows列表:",
        FirewareversionlistStore.FirewaredetailEdit,
    );
    return FirewareversionlistStore.FirewaredetailEdit;
};

export const useproxy_FirewareversiontableUrl = () => {
    var FirewareversionlistStore = useProxy(FirewareverdetailStoreProxy);
    console.info(
        "调用useFirewareversionlistRows,返回Rows列表:",
        FirewareversionlistStore.FirewaredetailEdit,
    );
    return FirewareversionlistStore.FirewareversiontableUrl;
};
export const initialFirewaredetailParams: FirmwareDetail = {
    isUpload: "false"
};
