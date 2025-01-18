import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../../grpcClinet/grpcWsvClient";
import {Apps} from "../../../../../api/ws/v1/wm_pb";
import {InsertAppsRequest, InsertAppsResponse,} from "../../../../../api/ws/v1/ws_pb";

export const grpcAppsInsert = async (
    addAppsParams: Apps,
    token: string,
): Promise<InsertAppsResponse> => {
    const req = new InsertAppsRequest({
        apps: addAppsParams,
    });
    console.info("InsertAppsListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.insertApps(req, {headers: headers});
        console.info("InsertAppsListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertAppsResponse();
};
