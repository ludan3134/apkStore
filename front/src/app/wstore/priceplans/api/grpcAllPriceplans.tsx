import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../grpcClinet/grpcWsvClient";
import {QueryAllPricePlanRequest, QueryAllPricePlanResponse,} from "../../../../api/ws/v1/ws_pb";

export const grpcAllPriceplans = async (
    token: string,
): Promise<QueryAllPricePlanResponse> => {
    const req = new QueryAllPricePlanRequest({});
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.queryAllPricePlan(req, {headers: headers});
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
    return new QueryAllPricePlanResponse();
};
