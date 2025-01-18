import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryAllEpgRequest, QueryAllEpgResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";

export const grpcAllepg = async (
    limit: number,
    name: string,
    token: string,
): Promise<QueryAllEpgResponse> => {
    const req = new QueryAllEpgRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        name: name,
        limit: limit,
    });
    console.info("grpcAllchannel-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryAllEpg(req, {headers: headers});
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
    return new QueryAllChannelResponse();
};
