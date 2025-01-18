import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryVodTypeItemListRequest, QueryVodTypeItemListResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {VodTypeItem} from "../../../../../api/ks/v1/km_pb";

export const grpcTypeThirdList = async (
    token: string,
    vid: number,
    page: number,
    rowsPerPage: number,
): Promise<QueryVodTypeItemListResponse> => {
    const req = new QueryVodTypeItemListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        vodTypeItem: new VodTypeItem({typeId: vid}),
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryVodTypeItemList(req, {headers: headers});
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
    return new QueryVodTypeItemListResponse();
};
