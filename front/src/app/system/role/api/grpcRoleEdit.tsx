import {ConnectError} from "@connectrpc/connect";
import {UpdateRoleRequest, UpdateRoleResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {Role} from "../../../../api/ax/v1/axm_pb";
import {message} from "antd";

export const grpcRoleEdit = async (
    role: Role,
    token: string,
): Promise<UpdateRoleResponse> => {
    const req = new UpdateRoleRequest({
        role: role,
    });
    var headers = new Headers();
    headers.set("token", token);
    console.info("grpcUpdateRole-req", req);

    try {
        const res = await AxvClient.updateRole(req, {headers: headers});
        console.info("grpcUpdateRole-res", res);
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
    return new UpdateRoleResponse();
};
