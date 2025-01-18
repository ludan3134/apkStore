import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {UpdateVodDesktopRequest, UpdateVodDesktopResponse} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {Vod} from "../../../../../api/ks/v1/km_pb";


export const grpcQueryDesktopEdit = async (
    token: string,
    vod: Vod
): Promise<UpdateVodDesktopResponse> => {
    const req = new UpdateVodDesktopRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        vod: vod

    });
    console.info("grpcAppsList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.updateVodDesktop(req, {
            headers: headers,
        });
        console.info("grpcAppsList-res", res);
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
    return new UpdateVodDesktopResponse();
};
