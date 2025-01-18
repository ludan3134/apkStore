import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {ConnectError} from "@connectrpc/connect";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {QueryUserListRequest, QueryUserListResponse,} from "../../../../api/ax/v1/ax_pb";
import {message} from "antd";

export const grpcUserList = async (
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryUserListResponse> => {
    const req = new QueryUserListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
    });
    console.info("grpcUser-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryUserList(req, {headers: headers});
        console.info("grpcUser-res", res);
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
    return new QueryUserListResponse();
};
