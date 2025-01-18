import {ConnectError} from "@connectrpc/connect";
import {UpdateRoleMenuRequest, UpdateRoleMenuResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {Menu} from "../../../../api/ax/v1/axm_pb";
import {message} from "antd";

export const grpcRoleMenuEdit = async (
    roleId: number,
    menulist: Menu[],
    token: string,
): Promise<UpdateRoleMenuResponse> => {
    const req = new UpdateRoleMenuRequest({
        roleId: roleId,
        menuList: menulist,
    });
    var headers = new Headers();
    headers.set("token", token);
    console.info("grpcUpdateRoleMenu-req", req);

    try {
        const res = await AxvClient.updateRoleMenu(req, {headers: headers});
        console.info("grpcUpdateRoleMenu-res", res);
        if (res === undefined) {
            return res;
        }
        if (res.status) {
            return res;
        }
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new UpdateRoleMenuResponse();
};
