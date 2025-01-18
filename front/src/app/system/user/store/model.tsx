import {RoleLabel, User, UserLabel} from "../../../../api/ax/v1/axm_pb";
import {Distributor} from "../../../../api/asm/v1/asm_pb";

export type UserlistStore = {
    editUser: User;
    rolist: RoleLabel[];
    distributorlist: Distributor[];
    usertableUrl: string;
    userlabelList: UserLabel[];
};
export type ChangePwd = {
    oldPwd: string;
    newPwd: string;
};
