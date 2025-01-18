import {ConnectError} from "@connectrpc/connect";
import {QueryMenuListRequest, QueryMenuListResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {message} from "antd";

export const grpcPermissionList = async (
    cursor: bigint,
    pageSize: number,
    token: string,
): Promise<QueryMenuListResponse> => {
    const req = new QueryMenuListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            loadingId: cursor,
            limit: pageSize,
        }),
    });
    var headers = new Headers();
    headers.set("token", token);
    console.info("grpcPermission-req", req);

    try {
        const res = await AxvClient.queryMenuList(req, {headers: headers});
        console.info("grpcPermission-res", res);
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
    return new QueryMenuListResponse();
};
