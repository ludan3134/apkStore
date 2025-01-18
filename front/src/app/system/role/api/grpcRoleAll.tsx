import {ConnectError} from "@connectrpc/connect";
import {QueryAllRoleRequest, QueryAllRoleResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {message} from "antd";

export const grpcRoleAll = async (
    token: string,
): Promise<QueryAllRoleResponse> => {
    var headers = new Headers();
    headers.set("token", token);
    const req = new QueryAllRoleRequest();
    console.info("grpcAllrole-req", req);
    try {
        const res = await AxvClient.queryAllRole(req, {headers: headers});
        console.info("grpcAllrole-res", res);
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
    return new QueryAllRoleResponse();
};
