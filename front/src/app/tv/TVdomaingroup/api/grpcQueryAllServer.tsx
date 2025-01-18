import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryAllServerRequest, QueryAllServerResponse,} from "../../../../api/as/v1/as_pb";
import {TVAsvClient} from "../../../../grpcClinet/grpcTVAsvClient";
import {authProxy} from "../../../auth/store/store";

export const grpcQueryAllServer = async (): Promise<QueryAllServerResponse> => {
    const req = new QueryAllServerRequest({});
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", authProxy.token);
    try {
        const res = await TVAsvClient.queryAllServer(req, {headers: headers});
        console.info("grpcTerminalList-res", res);
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
    return new QueryAllServerResponse();
};
