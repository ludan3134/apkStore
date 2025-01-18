import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {Top10Manager} from "../../../../../api/ks/v1/km_pb";
import {UpdateTop10ManagerRequest, UpdateTop10ManagerResponse} from "../../../../../api/ks/v1/ks_pb";


export const grpcUpdateVodAccount = async (
    top10Manager: Top10Manager,
    token: string,
): Promise<UpdateTop10ManagerResponse> => {
    const req = new UpdateTop10ManagerRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        top10Manager: top10Manager
    });
    console.info("grpcAppsEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.updateTop10Manager(req, {
            headers: headers,
        });
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
    return new UpdateTop10ManagerResponse();
};
