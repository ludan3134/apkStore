import {proxy} from "valtio";
import {LoginInfo} from "./model";
import {useProxy} from "valtio/utils";
import {Menu} from "../../../api/ax/v1/axm_pb";

const logininfo: LoginInfo = {
    userName: "",
    password: "",
    status: false,
    token: "",
    permissions: [] as Menu[],
    menu: [] as Menu[],
    buttons: [] as Menu[],
};
export const authProxy = proxy<LoginInfo>(logininfo);

export const useauthPermissionProxy = () => {
    var permissionStore = useProxy(authProxy);
    console.info(
        "调用useapkisRowChange,返回isisRowChange:",
        permissionStore.permissions,
    );
    return permissionStore.permissions;
};
export const useauthmenuProxy = () => {
    var permissionStore = useProxy(authProxy);
    console.info(
        "调用useapkisRowChange,返回isisRowChange:",
        permissionStore.menu,
    );
    return permissionStore.menu;
};
export const useauthbuttonsProxy = () => {
    var permissionStore = useProxy(authProxy);
    console.info(
        "调用useapkisRowChange,返回isisRowChange:",
        permissionStore.buttons,
    );
    return permissionStore.buttons;
};

export const useauthUserNameProxy = () => {
    var permissionStore = useProxy(authProxy);
    console.info(
        "调用useapkisRowChange,返回isisRowChange:",
        permissionStore.userName,
    );
    return permissionStore.userName;
};
