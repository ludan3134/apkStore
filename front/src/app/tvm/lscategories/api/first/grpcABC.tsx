import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {
    AnalysisLinkByMainClassIdRequest,
    AnalysisLinkByMainClassIdResponse,
    DeleteSubClassRequest,
    DeleteSubClassResponse,
} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";

export const grpcABC = async (
    subClassIds: number[],
    token: string,
): Promise<AnalysisLinkByMainClassIdResponse> => {
    const req = new AnalysisLinkByMainClassIdRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        ids: subClassIds,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.analysisLinkByMainClassId(req, {headers: headers});
        console.info("grpcTerminalEdit-res", res);
        if (res === undefined) {
            return res;
        }
        if (res.success) {
            return res;
        }
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.error("error code", er1.code, "error message", er1.message);
    }
    return new AnalysisLinkByMainClassIdResponse();
};
