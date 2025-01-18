import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryAccountInfoListRequest, QueryAccountInfoListResponse,} from "../../../../api/as/v1/as_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";
import {AccountFilter} from "../../../../api/asm/v1/asm_pb";

export const grpcAccountList = async (
    page: number,
    rowsPerPage: number,
    accountFilterModel: AccountFilter,
    token: string,
): Promise<QueryAccountInfoListResponse> => {
    const req = new QueryAccountInfoListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        accountFilter: accountFilterModel,
    });
    console.info("grpcAccountList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.queryAccountInfoList(req, {headers: headers});
        console.info("grpcAccountList-res", res);
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
    return new QueryAccountInfoListResponse();
};
