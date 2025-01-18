import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../grpcClinet/grpcWsvClient";
import {PricePlans} from "../../../../api/ws/v1/wm_pb";
import {UpdatePricePlansRequest, UpdatePricePlansResponse,} from "../../../../api/ws/v1/ws_pb";

export const grpcpriceplansEdit = async (
    add: PricePlans,
    token: string,
): Promise<UpdatePricePlansResponse> => {
    const req = new UpdatePricePlansRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pricePlans: add,
    });
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.updatePricePlans(req, {headers: headers});
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
    return new UpdatePricePlansResponse();
};
