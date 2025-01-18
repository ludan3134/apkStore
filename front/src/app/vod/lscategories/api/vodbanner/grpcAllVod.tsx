import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";

import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {QueryAllVodRequest, QueryAllVodResponse} from "../../../../../api/ks/v1/ks_pb";
import {authProxy} from "../../../../auth/store/store";

export const grpcAllVod = async (
    classId: number,
    name: string
): Promise<QueryAllVodResponse> => {
    const req = new QueryAllVodRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        limit: 10,
        classId: classId,
        name: name
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", authProxy.token);
    try {
        const res = await KsvClient.queryAllVod(req, {headers: headers});
        console.info("grpcTerminalList-res", res);
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
    return new QueryAllVodResponse();
};
