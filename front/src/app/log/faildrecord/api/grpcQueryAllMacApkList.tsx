import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {QueryAllMacApkListRequest, QueryAllMacApkListResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {MacApk} from "../../../../api/ax/v1/axm_pb";

export const grpcQueryAllMacApkList = async (
    macapkfilter: MacApk,
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryAllMacApkListResponse> => {
    const req = new QueryAllMacApkListRequest({
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        macApkFilter: macapkfilter,
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryAllMacApkList(req, {
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
    return new QueryAllMacApkListResponse();
};
