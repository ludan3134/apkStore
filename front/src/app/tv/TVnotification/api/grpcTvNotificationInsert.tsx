import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {InsertNotificationRequest, InsertNotificationResponse,} from "../../../../api/tv_fs/v1/fs_pb";
import {Notification} from "../../../../api/tv_fs/v1/fm_pb";
import {TVFsvClient} from "../../../../grpcClinet/grpcTVFsvClient";

export const grpcTvNotificationInsert = async (
    notification: Notification,
    token: string,
): Promise<InsertNotificationResponse> => {
    const req = new InsertNotificationRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        notification: notification,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.insertNotification(req, {headers: headers});
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
    return new InsertNotificationResponse();
};
