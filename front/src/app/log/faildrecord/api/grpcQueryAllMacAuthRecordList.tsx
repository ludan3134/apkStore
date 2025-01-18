import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {QueryAllMacAuthRecordListRequest, QueryAllMacAuthRecordListResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";

export const grpcQueryAllMacAuthRecordList = async (
    // macauthfilter: MacAuthRecord,
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryAllMacAuthRecordListResponse> => {
    const req = new QueryAllMacAuthRecordListRequest({
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        // macAuthFilter: macauthfilter,
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryAllMacAuthRecordList(req, {
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
    return new QueryAllMacAuthRecordListResponse();
};
