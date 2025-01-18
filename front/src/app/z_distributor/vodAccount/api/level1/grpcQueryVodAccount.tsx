import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {QueryTop10ManagerListRequest, QueryTop10ManagerListResponse} from "../../../../../api/ks/v1/ks_pb";


export const grpcQueryVodAccount = async (
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryTop10ManagerListResponse> => {
    const req = new QueryTop10ManagerListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
    });
    console.info("grpcAppsList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryTop10ManagerList(req, {
            headers: headers,
        });
        console.info("grpcAppsList-res", res);
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
    return new QueryTop10ManagerListResponse();
};
