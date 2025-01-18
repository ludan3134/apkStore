import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {Advertisement} from "../../../../api/fs/v1/fm_pb";
import {QueryAdvertisementListRequest, QueryAdvertisementListResponse,} from "../../../../api/fs/v1/fs_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";

export const grpcAddList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    addfilter: Advertisement,
): Promise<QueryAdvertisementListResponse> => {
    const req = new QueryAdvertisementListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        advertisement: addfilter,
    });
    console.info("grpcAdvList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.queryAdvertisementList(req, {
            headers: headers,
        });
        console.info("grpcAdvList-res", res);
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
    return new QueryAdvertisementListResponse();
};
