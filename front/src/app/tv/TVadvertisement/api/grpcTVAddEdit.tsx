import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {Advertisement} from "../../../../api/fs/v1/fm_pb";
import {UpdateAdvertisementRequest, UpdateAdvertisementResponse,} from "../../../../api/fs/v1/fs_pb";
import {TVFsvClient} from "../../../../grpcClinet/grpcTVFsvClient";

export const grpcTVAddEdit = async (
    add: Advertisement,
    token: string,
): Promise<UpdateAdvertisementResponse> => {
    const req = new UpdateAdvertisementRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        advertisement: add,
    });
    console.info("grpcAddEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.updateAdvertisement(req, {
            headers: headers,
        });
        console.info("grpcAddEdit-res", res);
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
    return new UpdateAdvertisementResponse();
};
