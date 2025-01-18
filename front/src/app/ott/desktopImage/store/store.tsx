import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {DesktopStore} from "./model";
import {AdvertisementPicture} from "../../../../api/fs/v1/fm_pb";
import {DistributorLabel, ModelLabel} from "../../../../api/ax/v1/axm_pb";
import {authProxy} from "../../../auth/store/store";

export const DesktopImageStoreProxy = proxy<DesktopStore>({
    DesktopImageEdit: {} as AdvertisementPicture,
    DesktopImageList: [] as AdvertisementPicture[],
    IsBackgroundFileUpload: false,
    distributor: {} as DistributorLabel,
    model: {} as ModelLabel,
    DesktopImageUrl: "",
    DesktopImageFilter: {} as AdvertisementPicture,
});

export const useproxy_DesktopImageEdit = () => {
    var DesktopImagelistStore = useProxy(DesktopImageStoreProxy);
    console.info(
        "调用useDesktopImagelistRows,返回Rows列表:",
        DesktopImagelistStore.DesktopImageEdit,
    );
    return DesktopImagelistStore.DesktopImageEdit;
};

export const useproxy_DesktopImagetableUrl = () => {
    var DesktopImagelistStore = useProxy(DesktopImageStoreProxy);
    console.info(
        "调用useDesktopImagelistRows,返回Rows列表:",
        DesktopImagelistStore.DesktopImageUrl,
    );
    return DesktopImagelistStore.DesktopImageUrl;
};
export const useproxy_DesktopImagedistributor = () => {
    var DesktopImagelistStore = useProxy(DesktopImageStoreProxy);
    console.info(
        "调用useDesktopImagelistRows,返回Rows列表:",
        DesktopImagelistStore.distributor,
    );
    return DesktopImagelistStore.distributor;
};
export const useproxy_DesktopImagemodel = () => {
    var DesktopImagelistStore = useProxy(DesktopImageStoreProxy);
    console.info(
        "调用useDesktopImagelistRows,返回Rows列表:",
        DesktopImagelistStore.model,
    );
    return DesktopImagelistStore.model;
};
export const useproxy_DesktopImageFilter = () => {
    var DesktopImagelistStore = useProxy(DesktopImageStoreProxy);
    console.info(
        "调用useDesktopImagelistRows,返回Rows列表:",
        DesktopImagelistStore.model,
    );
    return DesktopImagelistStore.DesktopImageFilter;
};
export const pre_DesktopImagelistLoader = async () => {
    var permissions = authProxy.permissions;
    var desktopOImageTable = permissions.find((option) => option.name === "查看桌面广告图片");
    DesktopImageStoreProxy.DesktopImageUrl = `${desktopOImageTable?.url}/${desktopOImageTable?.id}`;
    return true;
};

export const initialDesktopImagefilterParams: AdvertisementPicture = {
    id: "",
    version: "",
    md5: "",
    url: "",
    content: "",
    distributorId: "",
    modelId: "",
    isUse: false,
};
