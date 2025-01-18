import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryAllPlaybackRequest, QueryAllPlaybackResponse,} from "../../../../api/ks/v1/ks_pb";

export const grpcAllPlayback = async (
    limit: number,
    name: string,
    token: string,
): Promise<QueryAllPlaybackResponse> => {
    const req = new QueryAllPlaybackRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        name: name,
        limit: limit,
    });
    console.info("grpcAllchannel-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryAllPlayback(req, {headers: headers});
        console.info("grpcAllchannel-res", res);
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
    return new QueryAllPlaybackResponse();
};
