import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVFirewareStore} from "./model";
import {Firmware} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";

export const TVFirewareStoreProxy = proxy<TVFirewareStore>({
    TVFirewareEdit: {} as Firmware,
    TVFirewarelist: [],
    TVFirewareFilter: {} as Firmware,
    TVFirewaretableUrl: "",
});

export const useproxy_TVFirewareEdit = () => {
    var TVFirewarelistStore = useProxy(TVFirewareStoreProxy);
    console.info(
        "调用useTVFirewarelistRows,返回Rows列表:",
        TVFirewarelistStore.TVFirewareEdit,
    );
    return TVFirewarelistStore.TVFirewareEdit;
};
export const useproxy_TVFirewareFilter = () => {
    var TVFirewarelistStore = useProxy(TVFirewareStoreProxy);
    console.info(
        "调用useTVFirewarelistRows,返回Rows列表:",
        TVFirewarelistStore.TVFirewareFilter,
    );
    return TVFirewarelistStore.TVFirewareFilter;
};
export const useproxy_TVFirewaretableUrl = () => {
    var TVFirewarelistStore = useProxy(TVFirewareStoreProxy);
    console.info(
        "调用useTVFirewarelistRows,返回Rows列表:",
        TVFirewarelistStore.TVFirewaretableUrl,
    );
    return TVFirewarelistStore.TVFirewaretableUrl;
};
export const initialTVFirewareParams = {};
export const pre_TVFirewarelistLoader = async () => {
    var permissions = authProxy.permissions;
    var TVFirewareTable = permissions.find(
        (option) => option.name === "查看电视固件",
    );
    TVFirewareStoreProxy.TVFirewaretableUrl = `${TVFirewareTable?.url}/${TVFirewareTable?.id}`;
    return true;
};
