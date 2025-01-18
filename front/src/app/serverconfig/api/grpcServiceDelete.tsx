import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {DeleteServerConfigRequest, DeleteServerConfigResponse,} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";

export const grpcServiceDelete = async (
    ServerConfigIds: number[],
    token: string,
): Promise<DeleteServerConfigResponse> => {
    const req = new DeleteServerConfigRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        serverConfigId: ServerConfigIds,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.deleteServerConfig(req, {headers: headers});
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
    return new DeleteServerConfigResponse();
};
