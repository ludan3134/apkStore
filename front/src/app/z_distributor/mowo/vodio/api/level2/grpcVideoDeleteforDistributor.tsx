import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {DeleteVideoRequest, DeleteVideoResponse,} from "../../../../../../api/ta/v1/tas_pb";
import {TsvClient} from "../../../../../../grpcClinet/grpcTsvClient";
import {Video} from "../../../../../../api/ta/v1/tam_pb";

export const grpcVideoDeleteforDistributor = async (
    row: Video,
    token: string,
): Promise<DeleteVideoResponse> => {
    const req = new DeleteVideoRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        id: row.id,
        distributorId: row.distributorId,
        modelId: row.modelId,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.deleteVideo(req, {headers: headers});
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
    return new DeleteVideoResponse();
};
