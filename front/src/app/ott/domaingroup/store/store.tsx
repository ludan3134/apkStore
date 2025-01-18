import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ServerGroupStore} from "./model";
import {authProxy} from "../../../auth/store/store";
import {ServerGroup} from "../../../../api/asm/v1/asm_pb";
import {grpcQueryAllServer} from "../api/grpcQueryAllServer";

export const ServerGroupStoreProxy = proxy<ServerGroupStore>({
    ServerGroupEdit: {} as ServerGroup,
    ServerGrouplist: [],
    ServerGroupFilter: {} as ServerGroup,
    ServerGrouptableUrl: "",
    serverList: null,
});

export const useproxy_ServerGroupEdit = () => {
    var ServerGrouplistStore = useProxy(ServerGroupStoreProxy);
    console.info(
        "调用useServerGrouplistRows,返回Rows列表:",
        ServerGrouplistStore.ServerGroupEdit,
    );
    return ServerGrouplistStore.ServerGroupEdit;
};
export const useproxy_ServerGroupFilter = () => {
    var ServerGrouplistStore = useProxy(ServerGroupStoreProxy);
    console.info(
        "调用useServerGrouplistRows,返回Rows列表:",
        ServerGrouplistStore.ServerGroupFilter,
    );
    return ServerGrouplistStore.ServerGroupFilter;
};
export const useproxy_ServerGrouptableUrl = () => {
    var ServerGrouplistStore = useProxy(ServerGroupStoreProxy);
    console.info(
        "调用useServerGrouplistRows,返回Rows列表:",
        ServerGrouplistStore.ServerGrouptableUrl,
    );
    return ServerGrouplistStore.ServerGrouptableUrl;
};
export const useproxy_ServerGroupServerList = () => {
    var ServerGrouplistStore = useProxy(ServerGroupStoreProxy);
    console.info(
        "调用useServerGrouplistRows,返回Rows列表:",
        ServerGrouplistStore.serverList,
    );
    return ServerGrouplistStore.serverList;
};
export const initialServerGroupParams: ServerGroup = {
    id: 0,
    name: "",
    startMac: "",
    endMac: "",
    count: 0,
};
export const pre_ServerGrouplistLoader = async () => {
    var permissions = authProxy.permissions;
    var ServerGroupTable = permissions.find(
        (option) => option.name === "查看域名分组",
    );
    ServerGroupStoreProxy.ServerGrouptableUrl = `${ServerGroupTable?.url}/${ServerGroupTable?.id}`;
    var res = await grpcQueryAllServer();
    ServerGroupStoreProxy.serverList = res.serverList;
    // grpcDistributorToModel()
    return true;
};
