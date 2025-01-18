import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
import {Video} from "../../../../api/ta/v1/tam_pb";
import {UpdateVideoRequest, UpdateVideoResponse,} from "../../../../api/ta/v1/tas_pb";

export const grpcVideoEdit = async (
    Video: Video,
    token: string,
): Promise<UpdateVideoResponse> => {
    const req = new UpdateVideoRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        video: Video,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.updateVideo(req, {headers: headers});
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
    return new UpdateVideoResponse();
};
