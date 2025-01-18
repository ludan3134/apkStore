import {ConnectError} from "@connectrpc/connect";
import {Notification} from "../../../../api/fs/v1/fm_pb";
import {message} from "antd";
import {UpdateNotificationRequest, UpdateNotificationResponse,} from "../../../../api/fs/v1/fs_pb";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";

export const grpcNotificationEdit = async (
    notification: Notification,
    token: string,
): Promise<UpdateNotificationResponse> => {
    const req = new UpdateNotificationRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        notification: notification,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.updateNotification(req, {headers: headers});
        console.info("grpcTerminalEdit-res", res);
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
    return new UpdateNotificationResponse();
};
