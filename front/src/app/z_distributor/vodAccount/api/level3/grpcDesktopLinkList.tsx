import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryVodDesktopLinkListRequest, QueryVodDesktopLinkListResponse} from "../../../../../api/ks/v1/ks_pb";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";


export const grpcDesktopLinkList = async (
    page: number,
    rowsPerPage: number,
    firstId: number,
    token: string,
): Promise<QueryVodDesktopLinkListResponse> => {
    const req = new QueryVodDesktopLinkListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        vid: firstId
    });
    console.info("grpcAppsList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryVodDesktopLinkList(req, {
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
    return new QueryVodDesktopLinkListResponse();
};
