import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {InsertVodDesktopLinkRequest, InsertVodDesktopLinkResponse} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {VodLink} from "../../../../../api/ks/v1/km_pb";


export const grpcDesktopLinkInsert = async (
    token: string,
    vodlink: VodLink,
): Promise<InsertVodDesktopLinkResponse> => {
    const req = new InsertVodDesktopLinkRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        vodLink: vodlink
    });
    console.info("grpcAppsList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.insertVodDesktopLink(req, {
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
    return new InsertVodDesktopLinkResponse();
};
