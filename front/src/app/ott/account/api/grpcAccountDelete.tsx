import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {DeleteAccountInfoListRequest, DeleteAccountInfoListResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcAccountDelete = async (
    accountIds: string[],
    token: string,
): Promise<DeleteAccountInfoListResponse> => {
    const req = new DeleteAccountInfoListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        accountId: accountIds,
    });
    console.info("grpcAccountDelete-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.deleteAccountInfoList(req, {
            headers: headers,
        });
        console.info("grpcAccountDelete-res", res);
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
    return new DeleteAccountInfoListResponse();
};
