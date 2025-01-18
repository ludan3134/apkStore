import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";

import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {QueryVodBannerListRequest, QueryVodBannerListResponse,} from "../../../../../api/ks/v1/ks_pb";
import {VodBanner} from "../../../../../api/ks/v1/km_pb";

export const grpcVodbannerList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    classId: number
): Promise<QueryVodBannerListResponse> => {
    const req = new QueryVodBannerListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        vodBanner: new VodBanner({classId: classId})
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryVodBannerList(req, {headers: headers});
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
    return new QueryVodBannerListResponse();
};
