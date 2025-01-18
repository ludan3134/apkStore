import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryNotificationListRequest, QueryNotificationListResponse} from "../../../../api/fs/v1/fs_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";
import {Notification} from "../../../../api/fs/v1/fm_pb";

export const grpcNotificationList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    notification: Notification
): Promise<QueryNotificationListResponse> => {
    const req = new QueryNotificationListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        notification: notification
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.queryNotificationList(req, {
            headers: headers,
        });
        console.info("grpcTerminalList-res", res);
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
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new QueryNotificationListResponse();
};
