import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";
import {UpdateServerRequest, UpdateServerResponse,} from "../../../../api/as/v1/as_pb";
import {Server} from "../../../../api/asm/v1/asm_pb";

export const grpcServerEdit = async (
    Server: Server,
    token: string,
): Promise<UpdateServerResponse> => {
    const req = new UpdateServerRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        server: Server,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.updateServer(req, {headers: headers});
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
    return new UpdateServerResponse();
};
