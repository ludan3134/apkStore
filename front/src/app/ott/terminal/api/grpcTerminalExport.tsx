import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TerminalFilter} from "../../../../api/asm/v1/asm_pb";
import {ExportTerminalInfoListRequest, ExportTerminalInfoListResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcTerminalExport = async (
    terminalFilter: TerminalFilter,
    token: string,
): Promise<ExportTerminalInfoListResponse> => {
    const req = new ExportTerminalInfoListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        terminalFilter: terminalFilter,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.exportTerminalInfoList(req, {headers: headers});
        console.info("grpcAccountEdit-res", res);
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
    return new ExportTerminalInfoListResponse();
};
