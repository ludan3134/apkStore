import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryMacAccountListRequest, QueryMacAccountListResponse,} from "../../../../api/ks/v1/ks_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
import {MacAccount} from "../../../../api/ks/v1/km_pb";

export const grpcXCAccount = async (
    page: number,
    rowsPerPage: number,
    token: string,
    xcaccount: MacAccount,
): Promise<QueryMacAccountListResponse> => {
    const req = new QueryMacAccountListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        macAccount: xcaccount,
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryMacAccountList(req, {headers: headers});
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
    return new QueryMacAccountListResponse();
};
