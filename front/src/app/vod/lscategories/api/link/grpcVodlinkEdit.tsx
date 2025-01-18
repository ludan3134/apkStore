import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {UpdateVodLinkRequest, UpdateVodLinkResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {VodLink} from "../../../../../api/ks/v1/km_pb";

export const grpcVodVodLinkEdit = async (
    VodLink: VodLink,
    token: string,
): Promise<UpdateVodLinkResponse> => {
    const req = new UpdateVodLinkRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        vodLink: VodLink,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.updateVodLink(req, {headers: headers});
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
    return new UpdateVodLinkResponse();
};
