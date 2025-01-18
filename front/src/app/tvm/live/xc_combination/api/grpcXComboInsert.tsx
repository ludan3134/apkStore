import {ConnectError} from "@connectrpc/connect";
import {InsertXstreamComboRequest, InsertXstreamComboResponse,} from "../../../../../api/ks/v1/ks_pb";
import {XstreamCombo} from "../../../../../api/ks/v1/km_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {message} from "antd";

export const grpcXComboInsert = async (
    xstream: XstreamCombo,
    token: string,
): Promise<InsertXstreamComboResponse> => {
    const req = new InsertXstreamComboRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        xstreamCombo: xstream,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.insertXstreamCombo(req, {headers: headers});
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
    return new InsertXstreamComboResponse();
};
