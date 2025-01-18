import {ConnectError} from "@connectrpc/connect";
import {Menu} from "../../../../api/ax/v1/axm_pb";
import {InsertMenuRequest, InsertMenuResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {message} from "antd";

export const grpcPermissionAdd = async (
    menu: Menu,
    token: string,
): Promise<InsertMenuResponse> => {
    const req = new InsertMenuRequest({menu});
    console.info("InsertApkDetailRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.insertMenu(req, {headers: headers});
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
    return new InsertMenuResponse();
};
