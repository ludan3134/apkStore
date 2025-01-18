import {ConnectError} from "@connectrpc/connect";
import {DeleteRoleRequest, DeleteRoleResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {message} from "antd";

export const grpcRoleDelete = async (
    id: number,
    token: string,
): Promise<DeleteRoleResponse> => {
    const req = new DeleteRoleRequest({
        roleId: id,
    });
    var headers = new Headers();
    headers.set("token", token);
    console.info("grpcAddRole-req", req);

    try {
        const res = await AxvClient.deleteRole(req, {headers: headers});
        console.info("grpcAddRole-res", res);
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
    return new DeleteRoleResponse();
};
