import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {ApkFilter} from "../../../../../api/fs/v1/fm_pb";
import {QueryApkListRequest, QueryApkListResponse,} from "../../../../../api/fs/v1/fs_pb";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {TVFsvClient} from "../../../../../grpcClinet/grpcTVFsvClient";

export const grpcApkList = async (
    page: number,
    rowsPerPage: number,
    apkFilterModel: ApkFilter,
    token: string,
): Promise<QueryApkListResponse> => {
    const req = new QueryApkListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        apkFilter: apkFilterModel,
    });
    console.info("grpcApkList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.queryApkList(req, {headers: headers});
        console.info("grpcApkList-res", res);
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
    return new QueryApkListResponse();
};
