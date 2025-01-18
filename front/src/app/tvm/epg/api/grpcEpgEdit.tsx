import {UpdateMajorEventRequest, UpdateMajorEventResponse,} from "../../../../api/ks/v1/ks_pb";
import {MajorEvent} from "../../../../api/ks/v1/km_pb";
import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";

export const grpcEpgEdit = async (
    add: MajorEvent,
    token: string,
): Promise<UpdateMajorEventResponse> => {
    const req = new UpdateMajorEventRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        majorEvent: add,
    });
    console.info("grpcAddEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.updateMajorEvent(req, {headers: headers});
        console.info("grpcAddEdit-res", res);
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
    return new UpdateMajorEventResponse();
};
