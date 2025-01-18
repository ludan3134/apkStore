import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {
    UpdateAccountInfoListStatusRequest,
    UpdateAccountInfoListStatusResponse,
    UpdateAccountInfoResponse,
} from "../../../../api/tv_as/v1/as_pb";
import {TVAsvClient} from "../../../../grpcClinet/grpcTVAsvClient";

export const grpcTVAccountUpdateAll = async (
    distributorId: string | undefined,
    lotId: string,
    isActive: boolean,
    isService: boolean,
    isAuth: boolean,
    token: string,
): Promise<UpdateAccountInfoListStatusResponse> => {
    const req = new UpdateAccountInfoListStatusRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        distributorId: distributorId,
        lotId: lotId,
        isActive: isActive,
        isService: isService,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVAsvClient.updateAccountInfoListStatus(req, {
            headers: headers,
        });
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
