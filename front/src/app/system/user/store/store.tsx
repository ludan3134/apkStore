import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {UserlistStore} from "./model";
import {RoleLabel, User, UserLabel} from "../../../../api/ax/v1/axm_pb";
import {Distributor} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcRoleAll} from "../../role/api/grpcRoleAll";

export const UserlistStoreProxy = proxy<UserlistStore>({
    editUser: {} as User,
    distributorlist: [] as Distributor[],
    rolist: [] as RoleLabel[],
    usertableUrl: "",
    userlabelList: [] as UserLabel[],
});
export const useUserlistrolist = () => {
    var UserlistStore = useProxy(UserlistStoreProxy);
    console.info(
        "调用useapkPaginationModel,返回PaginationModel列表:",
        UserlistStore.rolist,
    );
    return UserlistStore.rolist;
};
export const useUsertableUrl = () => {
    var UserlistStore = useProxy(UserlistStoreProxy);
    return UserlistStore.usertableUrl;
};
export const useUserlablelist = () => {
    var UserlistStore = useProxy(UserlistStoreProxy);
    return UserlistStore.userlabelList;
};

export const useUserlisteditUser = () => {
    var UserlistStore = useProxy(UserlistStoreProxy);
    console.info("调用useUserlistRows,返回Rows列表:", UserlistStore.editUser);
    return UserlistStore.editUser;
};
export const initialUserParams = {
    id: 0,
    userName: "",
    password: "",
    deleted: false,
    created: "",
    updated: "",
    roleId: 3,
    status: false,
    distributorId: 0,
};
export const userIsforbinOption = [
    {
        id: true,
        label: "启用",
    },
    {
        id: false,
        label: "禁用",
    },
];
export const UserProxyLoder = async () => {
    var roleListResponse = await grpcRoleAll(authProxy.token);
    UserlistStoreProxy.rolist = roleListResponse.roleList;
    var permissions = authProxy.permissions;
    var UserTable = permissions.find((option) => option.name === "查看用户");
    UserlistStoreProxy.usertableUrl = `${UserTable?.url}/${UserTable?.id}`;
    return true;
};
