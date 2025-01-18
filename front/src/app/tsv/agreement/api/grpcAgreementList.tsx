import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
import {QueryAgreementListRequest, QueryAgreementListResponse,} from "../../../../api/ta/v1/tas_pb";

export const grpcAgreementList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    distirbutorvalue: string,
    modelvalue: string,
): Promise<QueryAgreementListResponse> => {
    const req = new QueryAgreementListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: {limit: rowsPerPage, pageIndex: page},
        filter: {
            distributorId: distirbutorvalue,
            modelId: modelvalue,
        },
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.queryAgreementList(req, {headers: headers});
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
    return new QueryAgreementListResponse();
};
