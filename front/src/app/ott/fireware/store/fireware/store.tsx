import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {FirewareStore} from "./model";
import {Firmware} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";

export const FirewareStoreProxy = proxy<FirewareStore>({
    FirewareEdit: {} as Firmware,
    Firewarelist: [],
    FirewareFilter: {} as Firmware,
    FirewaretableUrl: "",
});

export const useproxy_FirewareEdit = () => {
    var FirewarelistStore = useProxy(FirewareStoreProxy);
    console.info(
        "调用useFirewarelistRows,返回Rows列表:",
        FirewarelistStore.FirewareEdit,
    );
    return FirewarelistStore.FirewareEdit;
};
export const useproxy_FirewareFilter = () => {
    var FirewarelistStore = useProxy(FirewareStoreProxy);
    console.info(
        "调用useFirewarelistRows,返回Rows列表:",
        FirewarelistStore.FirewareFilter,
    );
    return FirewarelistStore.FirewareFilter;
};
export const useproxy_FirewaretableUrl = () => {
    var FirewarelistStore = useProxy(FirewareStoreProxy);
    console.info(
        "调用useFirewarelistRows,返回Rows列表:",
        FirewarelistStore.FirewaretableUrl,
    );
    return FirewarelistStore.FirewaretableUrl;
};
export const initialFirewareParams = {};
export const pre_FirewarelistLoader = async () => {
    var permissions = authProxy.permissions;
    var FirewareTable = permissions.find((option) => option.name === "查看固件");
    FirewareStoreProxy.FirewaretableUrl = `${FirewareTable?.url}/${FirewareTable?.id}`;
    return true;
};
