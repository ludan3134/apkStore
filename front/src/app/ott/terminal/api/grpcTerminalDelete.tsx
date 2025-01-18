import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {DeleteTerminalInfoListRequest, DeleteTerminalInfoListResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcTerminalDelete = async (
    terminalIds: string[],
    token: string,
): Promise<DeleteTerminalInfoListResponse> => {
    const req = new DeleteTerminalInfoListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        terminalIds: terminalIds,
    });
    console.info("grpcTerminalDelete-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.deleteTerminalInfoList(req, {
            headers: headers,
        });
        console.info("grpcTerminalDelete-res", res);
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
    return new DeleteTerminalInfoListResponse();
};
