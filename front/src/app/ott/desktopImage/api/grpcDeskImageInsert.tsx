import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";
import {InsertAdvertisementPictureRequest, InsertAdvertisementPictureResponse,} from "../../../../api/fs/v1/fs_pb";
import {AdvertisementPicture} from "../../../../api/fs/v1/fm_pb";

export const grpcDeskImageInsert = async (
    addvertisementpicture: AdvertisementPicture[],
    token: string,
): Promise<InsertAdvertisementPictureResponse> => {
    const req = new InsertAdvertisementPictureRequest({
        advertisementPicture: addvertisementpicture,
    });
    console.info("InsertBackgroundListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.insertAdvertisementPicture(req, {
            headers: headers,
        });
        console.info("InsertBackgroundListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertAdvertisementPictureResponse();
};
