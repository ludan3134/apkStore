import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
import {QueryCategoryListRequest, QueryCategoryListResponse,} from "../../../../api/ta/v1/tas_pb";

export const grpcClassifyList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    classId: number,
): Promise<QueryCategoryListResponse> => {
    const req = new QueryCategoryListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: {limit: rowsPerPage, pageIndex: page},
        category: {classId: classId},
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.queryCategoryList(req, {headers: headers});
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
    return new QueryCategoryListResponse();
};
