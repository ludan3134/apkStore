import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {VodBanner} from "../../../../../api/ks/v1/km_pb";
import {InsertVodBannerRequest, InsertVodBannerResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";

export const grpcVodbannerInsert = async (
    vodBanner: VodBanner,
    token: string,
): Promise<InsertVodBannerResponse> => {
    const req = new InsertVodBannerRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        vodBanner: vodBanner,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.insertVodBanner(req, {headers: headers});
        console.info("grpcTerminalInsert-res", res);
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
    return new InsertVodBannerResponse();
};
