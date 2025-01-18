import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../../grpcClinet/grpcWsvClient";
import {Apps} from "../../../../../api/ws/v1/wm_pb";
import {UpdateAppsRequest, UpdateAppsResponse,} from "../../../../../api/ws/v1/ws_pb";

export const grpcAppsEdit = async (
    Apps: Apps,
    token: string,
): Promise<UpdateAppsResponse> => {
    const req = new UpdateAppsRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        apps: Apps,
    });
    console.info("grpcAppsEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.updateApps(req, {headers: headers});
        console.info("grpcAppsEdit-res", res);
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
    return new UpdateAppsResponse();
};
