import {ConnectError} from "@connectrpc/connect";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {WsvClient} from "../../../../../grpcClinet/grpcWsvClient";
import {message} from "antd";
import {QueryAppsVersionListRequest, QueryAppsVersionListResponse,} from "../../../../../api/ws/v1/ws_pb";

export const grpcAppsVersionList = async (
    AppsId: string,
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryAppsVersionListResponse> => {
    const req = new QueryAppsVersionListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        appId: AppsId,
    });
    console.info("grpcAppsVersionList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.queryAppsVersionList(req, {headers: headers});
        console.info("grpcAppsVersionList-res", res);
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
    return new QueryAppsVersionListResponse();
};
