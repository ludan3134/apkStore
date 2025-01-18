import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {DeleteVodDesktopLinkRequest, DeleteVodDesktopLinkResponse} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";


export const grpcDesktopLinkDelete = async (
    id: number[],
    token: string,
): Promise<DeleteVodDesktopLinkResponse> => {
    const req = new DeleteVodDesktopLinkRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        id: id

    });
    console.info("grpcAppsList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.deleteVodDesktopLink(req, {
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
    return new DeleteVodDesktopLinkResponse();
};
