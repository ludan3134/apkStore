import {Menu} from "../../../../api/ax/v1/axm_pb";

export type PermissionStore = {
    permissionEidt: Menu;
    permissions: Menu[];
    isSelectNull: boolean;
    permissionUrl: string;
};
