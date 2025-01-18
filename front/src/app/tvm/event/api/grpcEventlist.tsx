import {QueryMajorEventListRequest, QueryMajorEventListResponse,} from "../../../../api/ks/v1/ks_pb";
import {CommonMeta, PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";

export const grpcEventlist = async (
    page: number,
    rowsPerPage: number,
    commonMeta: CommonMeta,
    token: string,
): Promise<QueryMajorEventListResponse> => {
    const req = new QueryMajorEventListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        commonMeta: commonMeta,
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryMajorEventList(req, {headers: headers});
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
    return new QueryMajorEventListResponse();
};
