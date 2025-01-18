import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {UpdateVodRequest, UpdateVodResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {Vod} from "../../../../../api/ks/v1/km_pb";

export const grpcVodSecondEdit = async (
    Vod: Vod,
    token: string,
): Promise<UpdateVodResponse> => {
    const req = new UpdateVodRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        vod: Vod,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.updateVod(req, {headers: headers});
        console.info("grpcTerminalEdit-res", res);
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
    return new UpdateVodResponse();
};
