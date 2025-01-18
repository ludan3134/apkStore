import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {AdvertisementPictureStore} from "./model";
import {AdvertisementPicture} from "../../../../../../api/tv_fs/v1/fm_pb";
import {authProxy} from "../../../../../auth/store/store";

export const AdvertisementPictureStoreProxy = proxy<AdvertisementPictureStore>({
    AdvertisementPictureEdit: {} as AdvertisementPicture,
    AdvertisementPicturelist: [],
    AdvertisementPictureFilter: {} as AdvertisementPicture,
    AdvertisementPicturetableUrl: "",
});

export const useproxy_AdvertisementPictureEdit = () => {
    var AdvertisementPicturelistStore = useProxy(AdvertisementPictureStoreProxy);
    console.info(
        "调用useAdvertisementPicturelistRows,返回Rows列表:",
        AdvertisementPicturelistStore.AdvertisementPictureEdit,
    );
    return AdvertisementPicturelistStore.AdvertisementPictureEdit;
};
export const useproxy_AdvertisementPictureFilter = () => {
    var AdvertisementPicturelistStore = useProxy(AdvertisementPictureStoreProxy);
    console.info(
        "调用useAdvertisementPicturelistRows,返回Rows列表:",
        AdvertisementPicturelistStore.AdvertisementPictureFilter,
    );
    return AdvertisementPicturelistStore.AdvertisementPictureFilter;
};
export const useproxy_AdvertisementPicturetableUrl = () => {
    var AdvertisementPicturelistStore = useProxy(AdvertisementPictureStoreProxy);
    console.info(
        "调用useAdvertisementPicturelistRows,返回Rows列表:",
        AdvertisementPicturelistStore.AdvertisementPicturetableUrl,
    );
    return AdvertisementPicturelistStore.AdvertisementPicturetableUrl;
};
export const initialAdvertisementPictureParams: AdvertisementPicture = {};
export const pre_AdvertisementPicturelistLoader = async () => {
    var permissions = authProxy.permissions;
    var AdvertisementPictureTable = permissions.find(
        (option) => option.name === "查看下级页面",
    );
    AdvertisementPictureStoreProxy.AdvertisementPicturetableUrl = `${AdvertisementPictureTable?.url}/${AdvertisementPictureTable?.id}`;
    return true;
};
