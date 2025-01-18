import {proxy} from "valtio";
import {RoleStore} from "./model";
import {useProxy} from "valtio/utils";
import {Role} from "../../../../api/ax/v1/axm_pb";

export const RoleStoreProxy = proxy<RoleStore>({
    editRole: {} as Role,
    rolelist: [],
});

export const useRoleditRole = () => {
    var RolestoreStore = useProxy(RoleStoreProxy);
    console.info(
        "调用useFirmwarelistRows,返回Rows列表:",
        RolestoreStore.editRole,
    );
    return RolestoreStore.editRole;
};

export const initialRoleParams = {
    id: 0,
    roleName: "",
};
