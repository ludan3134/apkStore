import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
import {DeleteDownloadConfigRequest, DeleteDownloadConfigResponse,} from "../../../../api/ta/v1/tas_pb";

export const grpcResourceDelete = async (
    ResourceIds: number,
    token: string,
): Promise<DeleteDownloadConfigResponse> => {
    const req = new DeleteDownloadConfigRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        id: ResourceIds,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.deleteDownloadConfig(req, {headers: headers});
        console.info("grpcAccountEdit-res", res);
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
    return new DeleteDownloadConfigResponse();
};
