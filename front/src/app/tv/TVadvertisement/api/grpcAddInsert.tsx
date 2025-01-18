import {message} from "antd";
import {Advertisement} from "../../../../api/fs/v1/fm_pb";
import {InsertAdvertisementRequest, InsertAdvertisementResponse,} from "../../../../api/fs/v1/fs_pb";
import {TVFsvClient} from "../../../../grpcClinet/grpcTVFsvClient";
import {ConnectError} from "@connectrpc/connect";

export const grpcAddInsert = async (
    addAddParams: Advertisement,
    token: string,
): Promise<InsertAdvertisementResponse> => {
    const req = new InsertAdvertisementRequest({
        advertisement: addAddParams,
    });
    console.info("InsertAddListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.insertAdvertisement(req, {
            headers: headers,
        });
        console.info("InsertAddListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertAdvertisementResponse();
};
