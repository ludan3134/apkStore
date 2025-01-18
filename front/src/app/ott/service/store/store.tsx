import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {PortalInfoStore} from "./model";
import {authProxy} from "../../../auth/store/store";
import {PortalInfo} from "../../../../api/asm/v1/asm_pb";

export const PortalInfoStoreProxy = proxy<PortalInfoStore>({
    PortalInfoEdit: {} as PortalInfo,
    PortalInfolist: [],
    PortalInfoFilter: {} as PortalInfo,
    PortalInfotableUrl: "",
});

export const useproxy_PortalInfoEdit = () => {
    var PortalInfolistStore = useProxy(PortalInfoStoreProxy);
    console.info(
        "调用usePortalInfolistRows,返回Rows列表:",
        PortalInfolistStore.PortalInfoEdit,
    );
    return PortalInfolistStore.PortalInfoEdit;
};
export const useproxy_PortalInfoFilter = () => {
    var PortalInfolistStore = useProxy(PortalInfoStoreProxy);
    console.info(
        "调用usePortalInfolistRows,返回Rows列表:",
        PortalInfolistStore.PortalInfoFilter,
    );
    return PortalInfolistStore.PortalInfoFilter;
};
export const useproxy_PortalInfotableUrl = () => {
    var PortalInfolistStore = useProxy(PortalInfoStoreProxy);
    console.info(
        "调用usePortalInfolistRows,返回Rows列表:",
        PortalInfolistStore.PortalInfotableUrl,
    );
    return PortalInfolistStore.PortalInfotableUrl;
};
export const initialPortalInfoParams: PortalInfo = {
    id: "",
    apkType: "",
    apkVersion: "",
    mwVersion: "",
    provider: "",
    serviceType: "",
    serviceUrl: "",
    isService: true,
    baseUrl: "",
};
export const pre_PortalInfolistLoader = async () => {
    var permissions = authProxy.permissions;
    var PortalInfoTable = permissions.find(
        (option) => option.name === "查看服务列表",
    );
    PortalInfoStoreProxy.PortalInfotableUrl = `${PortalInfoTable?.url}/${PortalInfoTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
