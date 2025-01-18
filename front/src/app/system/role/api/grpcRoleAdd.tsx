import {ConnectError} from "@connectrpc/connect";
import {InsertRoleRequest, InsertRoleResponse, QueryRoleListResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {Role} from "../../../../api/ax/v1/axm_pb";
import {message} from "antd";

export const grpcRoleAdd = async (
    role: Role,
    token: string,
): Promise<InsertRoleResponse> => {
    const req = new InsertRoleRequest({
        role: role,
    });
    var headers = new Headers();
    headers.set("token", token);
    console.info("grpcAddRole-req", req);

    try {
        const res = await AxvClient.insertRole(req, {headers: headers});
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
    return new QueryRoleListResponse();
};
