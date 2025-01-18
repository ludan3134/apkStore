import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {HomeBackgroundImage} from "../../../../api/fs/v1/fm_pb";
import {UpdateHomeBackgroundImageRequest, UpdateHomeBackgroundImageResponse,} from "../../../../api/fs/v1/fs_pb";
import {TVFsvClient} from "../../../../grpcClinet/grpcTVFsvClient";

export const grpcTVBackgroundEdit = async (
    add: HomeBackgroundImage,
    token: string,
): Promise<UpdateHomeBackgroundImageResponse> => {
    const req = new UpdateHomeBackgroundImageRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        homeBackgroundImage: add,
    });
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.updateHomeBackgroundImage(req, {
            headers: headers,
        });
        console.info("grpcBackgroundEdit-res", res);
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
    return new UpdateHomeBackgroundImageResponse();
};
