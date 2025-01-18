import {proxy} from "valtio";
import {PermissionStore} from "./model";
import {useProxy} from "valtio/utils";
import {grpcPermissionList} from "../api/grpcPermissionList";
import {authProxy} from "../../../auth/store/store";
import {Menu} from "../../../../api/ax/v1/axm_pb";

export const PermissionStoreProxy = proxy<PermissionStore>({
    permissions: [],
    isSelectNull: false,
    permissionEidt: {} as Menu,
    permissionUrl: "",
});

export const usePermissions = () => {
    var permissionStore = useProxy(PermissionStoreProxy);
    return permissionStore.permissions;
};
export const usePermissionEdit = () => {
    var permissionStore = useProxy(PermissionStoreProxy);
    return permissionStore.permissionEidt;
};
export const usePermissionIselectNull = () => {
    var permissionStore = useProxy(PermissionStoreProxy);
    return permissionStore.isSelectNull;
};

export const useproxy_PermssiontableUrl = () => {
    var PermssionlistStore = useProxy(PermissionStoreProxy);
    console.info(
        "调用usePermssionlistRows,返回Rows列表:",
        PermssionlistStore.permissionUrl,
    );
    return PermssionlistStore.permissionUrl;
};
export const permissionProxyLoader = async () => {
    var response = await grpcPermissionList(0n, 4096, authProxy.token);
    PermissionStoreProxy.permissions = response.menuList;
    var PermissionTree = PermissionStoreProxy.permissions.find(
        (option) => option.name === "查看权限",
    );
    PermissionStoreProxy.permissionUrl = `${PermissionTree?.url}/${PermissionTree?.id}`;
    return true;
};
export const initialPermissionParams = {
    id: 0,
    name: "",
    parentId: 0,
    status: false,
    type: "",
    url: "",
    path: "",
};
export const componentTypesOptions = [
    {
        id: 1,
        label: "菜单",
    },
    {
        id: 2,
        label: "页面组件",
    },
];
