import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {AccountInfo} from "../../../../api/asm/v1/asm_pb";
import {UpdateAccountInfoRequest, UpdateAccountInfoResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcAccountEdit = async (
    account: AccountInfo,
    token: string,
): Promise<UpdateAccountInfoResponse> => {
    const req = new UpdateAccountInfoRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        account: account,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.updateAccountInfo(req, {headers: headers});
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
    return new UpdateAccountInfoResponse();
};
