import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {TerminalInfo} from "../../../../api/asm/v1/asm_pb";
import {UpdateTerminalInfoRequest, UpdateTerminalInfoResponse,} from "../../../../api/as/v1/as_pb";
import {TVAsvClient} from "../../../../grpcClinet/grpcTVAsvClient";

export const grpTerminalEdit = async (
    terminal: TerminalInfo,
    token: string,
): Promise<UpdateTerminalInfoResponse> => {
    const req = new UpdateTerminalInfoRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        terminal: terminal,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVAsvClient.updateTerminalInfo(req, {headers: headers});
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
    return new UpdateTerminalInfoResponse();
};
