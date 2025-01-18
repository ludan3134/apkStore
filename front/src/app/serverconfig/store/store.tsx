import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ServerConfigStore} from "./model";
import {ServerConfig} from "../../../api/ax/v1/axm_pb";
import {authProxy} from "../../auth/store/store";

export const ServerConfigStoreProxy = proxy<ServerConfigStore>({
    ServerConfigEdit: {} as ServerConfig,
    ServerConfiglist: [],
    ServerConfigFilter: {} as ServerConfig,
    ServerConfigtableUrl: "",
});

export const useproxy_ServerConfigEdit = () => {
    var ServerConfiglistStore = useProxy(ServerConfigStoreProxy);
    console.info(
        "调用useServerConfiglistRows,返回Rows列表:",
        ServerConfiglistStore.ServerConfigEdit,
    );
    return ServerConfiglistStore.ServerConfigEdit;
};
export const useproxy_ServerConfigFilter = () => {
    var ServerConfiglistStore = useProxy(ServerConfigStoreProxy);
    console.info(
        "调用useServerConfiglistRows,返回Rows列表:",
        ServerConfiglistStore.ServerConfigFilter,
    );
    return ServerConfiglistStore.ServerConfigFilter;
};
export const useproxy_ServerConfigtableUrl = () => {
    var ServerConfiglistStore = useProxy(ServerConfigStoreProxy);
    console.info(
        "调用useServerConfiglistRows,返回Rows列表:",
        ServerConfiglistStore.ServerConfigtableUrl,
    );
    return ServerConfiglistStore.ServerConfigtableUrl;
};
export const initialServerConfigParams: ServerConfig = {
    id: 0,
    domain: "",
    addrType: 0,
    isUse: false,
};
export const pre_ServerConfiglistLoader = async () => {
    var permissions = authProxy.permissions;
    var ServerConfigTable = permissions.find(
        (option) => option.name === "查看下载地址列表",
    );
    ServerConfigStoreProxy.ServerConfigtableUrl = `${ServerConfigTable?.url}/${ServerConfigTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
