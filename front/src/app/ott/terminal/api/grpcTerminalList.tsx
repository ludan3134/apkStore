import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TerminalFilter} from "../../../../api/asm/v1/asm_pb";
import {QueryTerminalInfoListRequest, QueryTerminalInfoListResponse,} from "../../../../api/as/v1/as_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcTerminalList = async (
    page: number,
    rowsPerPage: number,
    terminalFilterModel: TerminalFilter,
    token: string,
): Promise<QueryTerminalInfoListResponse> => {
    const req = new QueryTerminalInfoListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        terminalFilter: terminalFilterModel,
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.queryTerminalInfoList(req, {
            headers: headers,
        });
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
    return new QueryTerminalInfoListResponse();
};
