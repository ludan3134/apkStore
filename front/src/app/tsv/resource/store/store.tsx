import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {ResourceStore} from "./model";
import {DownloadConfig} from "../../../../api/ta/v1/tam_pb";

export const ResourceStoreproxy = proxy<ResourceStore>({
    ResourceEdit: {} as DownloadConfig,
    Resourcelist: [],
    ResourceFilter: {} as DownloadConfig,
    ResourcetableUrl: "",
});

export const useproxy_ResourceEdit = () => {
    var DownloadConfigStore = useProxy(ResourceStoreproxy);
    console.info(
        "调用useDownloadConfigRows,返回Rows列表:",
        DownloadConfigStore.ResourceEdit,
    );
    return DownloadConfigStore.ResourceEdit;
};
export const useproxy_ResourceFilter = () => {
    var DownloadConfigStore = useProxy(ResourceStoreproxy);
    console.info(
        "调用useDownloadConfigRows,返回Rows列表:",
        DownloadConfigStore.ResourceFilter,
    );
    return DownloadConfigStore.ResourceFilter;
};
export const useproxy_ResourceUrl = () => {
    var DownloadConfigStore = useProxy(ResourceStoreproxy);
    console.info(
        "调用useDownloadConfigRows,返回Rows列表:",
        DownloadConfigStore.ResourcetableUrl,
    );
    return DownloadConfigStore.ResourcetableUrl;
};
export const initialDownloadConfigParams: DownloadConfig = {
    id: 0,
    domain: "",
};

export const pre_ResourceLoader = async () => {
    var permissions = authProxy.permissions;
    var DownloadConfigTable = permissions.find(
        (option) => option.name === "查看配置",
    );
    ResourceStoreproxy.ResourcetableUrl = `${DownloadConfigTable?.url}/${DownloadConfigTable?.id}`;
    return true;
};
