import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {QueryFailedRecordListRequest, QueryFailedRecordListResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {FailedRecord} from "../../../../api/ax/v1/axm_pb";

export const grpcFaildRecordList = async (
    page: number,
    rowsPerPage: number,
    failRecord: FailedRecord,
    token: string,
): Promise<QueryFailedRecordListResponse> => {
    const req = new QueryFailedRecordListRequest({
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        failedRecord: failRecord
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryFailedRecordList(req, {
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
    return new QueryFailedRecordListResponse();
};
