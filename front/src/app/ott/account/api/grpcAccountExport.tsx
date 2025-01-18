import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {AccountFilter} from "../../../../api/asm/v1/asm_pb";
import {ExportAccountInfoListRequest, ExportAccountInfoListResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcAccountExport = async (
    account: AccountFilter,
    token: string,
): Promise<ExportAccountInfoListResponse> => {
    const req = new ExportAccountInfoListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        accountFilter: account,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.exportAccountInfoList(req, {headers: headers});
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
    return new ExportAccountInfoListResponse();
};
