import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TVAsvClient} from "../../../../grpcClinet/grpcTVAsvClient";
import {Server} from "../../../../api/tv_asm/v1/asm_pb";
import {InsertServerRequest, InsertServerResponse,} from "../../../../api/tv_as/v1/as_pb";

export const grpcServerInsert = async (
    Server: Server,
    token: string,
): Promise<InsertServerResponse> => {
    const req = new InsertServerRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        server: Server,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVAsvClient.insertServer(req, {headers: headers});
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
    return new InsertServerResponse();
};
