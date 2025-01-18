import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {WsvClient} from "../../../../../grpcClinet/grpcWsvClient";
import {QueryAppsListRequest, QueryAppsListResponse,} from "../../../../../api/ws/v1/ws_pb";
import {Apps} from "../../../../../api/ws/v1/wm_pb";

export const grpcAppsList = async (
    page: number,
    rowsPerPage: number,
    appFilterModel: Apps,
    token: string,
): Promise<QueryAppsListResponse> => {
    const req = new QueryAppsListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        appsFilter: appFilterModel,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
    });
    console.info("grpcAppsList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.queryAppsList(req, {headers: headers});
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
    return new QueryAppsListResponse();
};
