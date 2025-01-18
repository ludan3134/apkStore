import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {ExportMainClassByExcelRequest, ExportMainClassByExcelResponse} from "../../../../../api/ks/v1/ks_pb";

export const grpcExportMainClassByExcel = async (
    ids: number[],
    token: string,
): Promise<ExportMainClassByExcelResponse> => {
    const req = new ExportMainClassByExcelRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        mainClassIds: ids,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.exportMainClassByExcel(req, {headers: headers});
        console.info("grpcAccountEdit-res", res);
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
    return new ExportMainClassByExcelResponse();
};
