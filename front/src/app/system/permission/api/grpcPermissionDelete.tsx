import {ConnectError} from "@connectrpc/connect";
import {DeleteMenuRequest, DeleteMenuResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {message} from "antd";

export const grpcPermissionDelete = async (
    menuId: number,
    token: string,
): Promise<DeleteMenuResponse> => {
    const req = new DeleteMenuRequest({menuId});
    console.info(" grpcDeletepermission-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.deleteMenu(req, {headers: headers});
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
    return new DeleteMenuResponse();
};
