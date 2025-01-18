import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {AdvertisementPicture} from "../../../../api/fs/v1/fm_pb";
import {UpdateAdvertisementPictureRequest, UpdateAdvertisementPictureResponse,} from "../../../../api/fs/v1/fs_pb";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";

export const grpcDeskImageEdit = async (
    add: AdvertisementPicture,
    token: string,
): Promise<UpdateAdvertisementPictureResponse> => {
    const req = new UpdateAdvertisementPictureRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        advertisementPicture: add,
    });
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.updateAdvertisementPicture(req, {
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
    return new UpdateAdvertisementPictureResponse();
};
