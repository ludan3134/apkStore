import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {VodType} from "../../../../../api/ks/v1/km_pb";
import {QueryVodTypeListRequest, QueryVodTypeListResponse} from "../../../../../api/ks/v1/ks_pb";

export const grpcTypeSecondList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    firstID: number,
): Promise<QueryVodTypeListResponse> => {
    const req = new QueryVodTypeListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        vodType: new VodType({classId: firstID})
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryVodTypeList(req, {headers: headers});
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
    return new QueryVodTypeListResponse();
};
