import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {AppVersion} from "../../../../../api/ws/v1/wm_pb";
import {UpdateAppsVersionRequest, UpdateAppsVersionResponse,} from "../../../../../api/ws/v1/ws_pb";
import {WsvClient} from "../../../../../grpcClinet/grpcWsvClient";

export const grpcAppsversionEdit = async (
    AppsversionDetail: AppVersion,
    token: string,
): Promise<UpdateAppsVersionResponse> => {
    const req = new UpdateAppsVersionRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        appVersion: AppsversionDetail,
    });
    console.info("grpcAppsversionEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.updateAppsVersion(req, {headers: headers});
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
    return new UpdateAppsVersionResponse();
};
