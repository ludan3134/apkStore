import {Menu} from "../../../api/ax/v1/axm_pb";

export type LoginInfo = {
    userName: string;
    password: string;
    status: boolean;
    token: string;
    permissions: Menu[];
    menu: Menu[];
    buttons: Menu[];
};
