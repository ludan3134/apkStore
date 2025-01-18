import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {DeleteVodLinkRequest, DeleteVodLinkResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";

export const grpcVodVodLinkDelete = async (
    VodLinkIds: number[],
    token: string,
): Promise<DeleteVodLinkResponse> => {
    const req = new DeleteVodLinkRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        id: VodLinkIds,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.deleteVodLink(req, {headers: headers});
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
    return new DeleteVodLinkResponse();
};
