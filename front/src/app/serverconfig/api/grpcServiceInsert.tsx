import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {InsertServerConfigRequest, InsertServerConfigResponse,} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {ServerConfig} from "../../../api/ax/v1/axm_pb";

export const grpcServerConfigInsert = async (
    ServerConfig: ServerConfig,
    token: string,
): Promise<InsertServerConfigResponse> => {
    const req = new InsertServerConfigRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        serverConfig: ServerConfig,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.insertServerConfig(req, {headers: headers});
        console.info("grpcTerminalInsert-res", res);
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
        console.error("error code", er1.code, "error message", er1.message);
    }
    return new InsertServerConfigResponse();
};
