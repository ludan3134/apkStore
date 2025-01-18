import {ConnectError} from "@connectrpc/connect";
import {QueryAllUserRequest, QueryAllUserV2Response,} from "../../../../api/ax/v1/ax_pb";
import {authProxy} from "../../../auth/store/store";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {message} from "antd";

export const grpcAllUser = async (): Promise<QueryAllUserV2Response> => {
    const req = new QueryAllUserRequest({});
    console.info("grpcModelToModel-req", req);
    var headers = new Headers();
    headers.set("token", authProxy.token);
    try {
        const res = await AxvClient.queryAllUserV2(req, {headers: headers});
        console.info("grpcModelToModel-res", res);
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
    return new QueryAllUserV2Response();
};
