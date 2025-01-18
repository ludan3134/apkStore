import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVDesktopStore} from "./model";
import {AdvertisementPicture,} from "../../../../api/fs/v1/fm_pb";
import {DistributorLabel, ModelLabel} from "../../../../api/ax/v1/axm_pb";
import {authProxy} from "../../../auth/store/store";

export const TVDesktopImageStoreProxy = proxy<TVDesktopStore>({
    TVDesktopImageEdit: {} as AdvertisementPicture,
    TVDesktopImageList: [] as AdvertisementPicture[],
    IsBackgroundFileUpload: false,
    distributor: {} as DistributorLabel,
    model: {} as ModelLabel,
    TVDesktopImageUrl: "",
    TVDesktopImageFilter: {} as AdvertisementPicture,
});

export const useproxy_TVDesktopImageEdit = () => {
    var TVDesktopImagelistv_tv_fstore = useProxy(TVDesktopImageStoreProxy);
    console.info(
        "调用useTVDesktopImagelistRows,返回Rows列表:",
        TVDesktopImagelistv_tv_fstore.TVDesktopImageEdit,
    );
    return TVDesktopImagelistv_tv_fstore.TVDesktopImageEdit;
};

export const useproxy_TVDesktopImagetableUrl = () => {
    var TVDesktopImagelistv_tv_fstore = useProxy(TVDesktopImageStoreProxy);
    console.info(
        "调用useTVDesktopImagelistRows,返回Rows列表:",
        TVDesktopImagelistv_tv_fstore.TVDesktopImageUrl,
    );
    return TVDesktopImagelistv_tv_fstore.TVDesktopImageUrl;
};
export const useproxy_TVDesktopImagedistributor = () => {
    var TVDesktopImagelistv_tv_fstore = useProxy(TVDesktopImageStoreProxy);
    console.info(
        "调用useTVDesktopImagelistRows,返回Rows列表:",
        TVDesktopImagelistv_tv_fstore.distributor,
    );
    return TVDesktopImagelistv_tv_fstore.distributor;
};
export const useproxy_TVDesktopImagemodel = () => {
    var TVDesktopImagelistv_tv_fstore = useProxy(TVDesktopImageStoreProxy);
    console.info(
        "调用useTVDesktopImagelistRows,返回Rows列表:",
        TVDesktopImagelistv_tv_fstore.model,
    );
    return TVDesktopImagelistv_tv_fstore.model;
};
export const useproxy_TVDesktopImageFilter = () => {
    var TVDesktopImagelistv_tv_fstore = useProxy(TVDesktopImageStoreProxy);
    console.info(
        "调用useTVDesktopImagelistRows,返回Rows列表:",
        TVDesktopImagelistv_tv_fstore.model,
    );
    return TVDesktopImagelistv_tv_fstore.TVDesktopImageFilter;
};
export const pre_TVDesktopImagelistLoader = async () => {
    var permissions = authProxy.permissions;
    var desktopOImageTable = permissions.find((option) => option.name === "查看电视桌面广告图片");
    TVDesktopImageStoreProxy.TVDesktopImageUrl = `${desktopOImageTable?.url}/${desktopOImageTable?.id}`;
    return true;
};

export const initialTVDesktopImagefilterParams: AdvertisementPicture = {
    id: "",
    version: "",
    md5: "",
    url: "",
    content: "",
    distributorId: "",
    modelId: "",
    isUse: false,
};
