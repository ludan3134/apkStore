import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../grpcClinet/grpcWsvClient";
import {UpdateAppUserRequest, UpdateAppUserResponse,} from "../../../../api/ws/v1/ws_pb";
import {AppUser} from "../../../../api/ws/v1/wm_pb";

export const grpcAppUserEdit = async (
    add: AppUser,
    token: string,
): Promise<UpdateAppUserResponse> => {
    const req = new UpdateAppUserRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        appUser: add,
    });
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.updateAppUser(req, {headers: headers});
        console.info("grpcBackgroundEdit-res", res);
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
    return new UpdateAppUserResponse();
};
