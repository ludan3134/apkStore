import {ConnectError} from "@connectrpc/connect";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {QueryRoleListRequest, QueryRoleListResponse,} from "../../../../api/ax/v1/ax_pb";
import {message} from "antd";

export const grpcRoleList = async (
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryRoleListResponse> => {
    const req = new QueryRoleListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
    });
    var headers = new Headers();
    headers.set("token", token);
    console.info("grpcRole-req", req);

    try {
        const res = await AxvClient.queryRoleList(req, {headers: headers});
        console.info("grpcRole-res", res);
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
    return new QueryRoleListResponse();
};
