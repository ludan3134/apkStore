import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ServerStore} from "./model";
import {authProxy} from "../../../auth/store/store";
import {Server} from "../../../../api/tv_asm/v1/asm_pb";

export const ServerStoreProxy = proxy<ServerStore>({
    ServerEdit: {} as Server,
    Serverlist: [],
    ServerFilter: {} as Server,
    ServertableUrl: "",
});

export const useproxy_ServerEdit = () => {
    var ServerlistStore = useProxy(ServerStoreProxy);
    console.info(
        "调用useServerlistRows,返回Rows列表:",
        ServerlistStore.ServerEdit,
    );
    return ServerlistStore.ServerEdit;
};
export const useproxy_ServerFilter = () => {
    var ServerlistStore = useProxy(ServerStoreProxy);
    console.info(
        "调用useServerlistRows,返回Rows列表:",
        ServerlistStore.ServerFilter,
    );
    return ServerlistStore.ServerFilter;
};
export const useproxy_ServertableUrl = () => {
    var ServerlistStore = useProxy(ServerStoreProxy);
    console.info(
        "调用useServerlistRows,返回Rows列表:",
        ServerlistStore.ServertableUrl,
    );
    return ServerlistStore.ServertableUrl;
};
export const initialServerParams: Server = {
    id: 0,
    domain: "",
    isUse: false,
    deleted: false,
};
export const pre_ServerlistLoader = async () => {
    var permissions = authProxy.permissions;
    var ServerTable = permissions.find(
        (option) => option.name === "查看电视域名",
    );
    ServerStoreProxy.ServertableUrl = `${ServerTable?.url}/${ServerTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
