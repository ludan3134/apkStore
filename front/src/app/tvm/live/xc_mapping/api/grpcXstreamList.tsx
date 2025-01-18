import {ConnectError} from "@connectrpc/connect";

import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {QueryXstreamResourceListRequest, QueryXstreamResourceListResponse,} from "../../../../../api/ks/v1/ks_pb";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {message} from "antd";
import {XstreamResource} from "../../../../../api/ks/v1/km_pb";

export const grpcXstreamList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    xstramResource: XstreamResource,
): Promise<QueryXstreamResourceListResponse> => {
    const req = new QueryXstreamResourceListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        xstreamResource: xstramResource,
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryXstreamResourceList(req, {
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
    return new QueryXstreamResourceListResponse();
};
