import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../../grpcClinet/grpcWsvClient";
import {Apps} from "../../../../../api/ws/v1/wm_pb";
import {CopyAppsRequest, CopyAppsResponse,} from "../../../../../api/ws/v1/ws_pb";

export const grpcAppsCopy = async (
    appcopys: Apps[],
    distributorId: string,
    modelId: string,
    categoriesIds: number[],
    priceplans: number[],
    token: string,
): Promise<CopyAppsResponse> => {
    const req = new CopyAppsRequest({
        apps: appcopys,
        distributorId: distributorId,
        modelId: modelId,
        categoriesIds: categoriesIds,
        pricePlans: priceplans,
    });
    console.info("CopyAppsRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.copyApps(req, {headers: headers});
        console.info("CopyAppsResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new CopyAppsResponse();
};
