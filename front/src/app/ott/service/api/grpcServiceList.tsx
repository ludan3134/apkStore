import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryPortalListResponse, QueryTerminalInfoListRequest,} from "../../../../api/as/v1/as_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcPortalInfoList = async (
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryPortalListResponse> => {
    const req = new QueryTerminalInfoListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.queryPortalList(req, {headers: headers});
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
    return new QueryPortalListResponse();
};
