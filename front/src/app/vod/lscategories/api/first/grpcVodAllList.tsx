import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";

import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {QueryAllVodClassRequest, QueryAllVodClassResponse,} from "../../../../../api/ks/v1/ks_pb";
import {authProxy} from "../../../../auth/store/store";

export const grpcVodAllList = async (): Promise<QueryAllVodClassResponse> => {
    const req = new QueryAllVodClassRequest();
    var headers = new Headers();
    headers.set("token", authProxy.token);
    try {
        const res = await KsvClient.queryAllVodClass(req, {headers: headers});
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
    return new QueryAllVodClassResponse();
};
