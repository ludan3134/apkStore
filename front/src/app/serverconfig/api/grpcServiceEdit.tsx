import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {UpdateServerConfigRequest, UpdateServerConfigResponse,} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {ServerConfig} from "../../../api/ax/v1/axm_pb";

export const grpcServerConfigEdit = async (
    ServerConfig: ServerConfig,
    token: string,
): Promise<UpdateServerConfigResponse> => {
    const req = new UpdateServerConfigRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        serverConfig: ServerConfig,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.updateServerConfig(req, {headers: headers});
        console.info("grpcTerminalEdit-res", res);
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
    return new UpdateServerConfigResponse();
};
