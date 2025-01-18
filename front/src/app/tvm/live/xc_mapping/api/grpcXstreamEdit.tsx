import {ConnectError} from "@connectrpc/connect";
import {UpdateXstreamResourceRequest, UpdateXstreamResourceResponse,} from "../../../../../api/ks/v1/ks_pb";
import {XstreamResource} from "../../../../../api/ks/v1/km_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {message} from "antd";

export const grpcXstreamEdit = async (
    xstream: XstreamResource,
    token: string,
): Promise<UpdateXstreamResourceResponse> => {
    const req = new UpdateXstreamResourceRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        xstreamResource: xstream,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.updateXstreamResource(req, {
            headers: headers,
        });
        console.info("grpcTerminalEdit-res", res);
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
    return new UpdateXstreamResourceResponse();
};
