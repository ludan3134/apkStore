import {ConnectError} from "@connectrpc/connect";
import {Menu} from "../../../../api/ax/v1/axm_pb";
import {UpdateMenuRequest, UpdateMenuResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {message} from "antd";

export const grpcPermissionEdit = async (
    menu: Menu,
    token: string,
): Promise<UpdateMenuResponse> => {
    const req = new UpdateMenuRequest({menu});
    console.info("UpdateApkDetailRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.updateMenu(req, {headers: headers});
        console.info("grpcAddPermission-res", res);
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
    return new UpdateMenuResponse();
};
