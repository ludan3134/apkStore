import {ConnectError} from "@connectrpc/connect";
import {InsertXstreamResourceRequest, InsertXstreamResourceResponse,} from "../../../../../api/ks/v1/ks_pb";
import {XstreamResource} from "../../../../../api/ks/v1/km_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {message} from "antd";

export const grpcXstreamInsert = async (
    xstream: XstreamResource,
    token: string,
): Promise<InsertXstreamResourceResponse> => {
    const req = new InsertXstreamResourceRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        xstreamResource: xstream,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.insertXstreamResource(req, {
            headers: headers,
        });
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
    return new InsertXstreamResourceResponse();
};
