import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import i18n from "../../../../i18n/i18n";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";
import {QueryRecommendApkListRequest, QueryRecommendApkListResponse,} from "../../../../api/fs/v1/fs_pb";
import {RecommendApk} from "../../../../api/fs/v1/fm_pb";

export const grpcRecommendList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    filterRecommend: RecommendApk,
): Promise<QueryRecommendApkListResponse> => {
    var language = i18n.language;
    console.log("当前语言", language);

    const req = new QueryRecommendApkListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: {limit: rowsPerPage, pageIndex: page, lang: language},
        recommendApk: filterRecommend,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.queryRecommendApkList(req, {
            headers: headers,
        });
        console.info("grpcTerminalInsert-res", res);
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
        console.error("error code", er1.code, "error message", er1.message);
    }
    return new QueryRecommendApkListResponse();
};
