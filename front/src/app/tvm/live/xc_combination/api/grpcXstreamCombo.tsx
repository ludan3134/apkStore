import {ConnectError} from "@connectrpc/connect";

import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {QueryAllXstreamComboRequest, QueryAllXstreamComboResponse,} from "../../../../../api/ks/v1/ks_pb";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";

export const grpcXstreamCombo =
    async (): Promise<QueryAllXstreamComboResponse> => {
        const req = new QueryAllXstreamComboRequest({
            transactionId: 6758n,
            sessionId: 7769n,
        });
        console.info("grpcTerminalList-req", req);
        var headers = new Headers();
        headers.set("token", authProxy.token);
        try {
            const res = await KsvClient.queryAllXstreamCombo(req, {
                headers: headers,
            });
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
        return new QueryAllXstreamComboResponse();
    };
