import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {InsertApkListByCopyRequest, InsertApkListByCopyResponse,} from "../../../../../api/fs/v1/fs_pb";
import {TVFsvClient} from "../../../../../grpcClinet/grpcTVFsvClient";

export const grpcApkCopy = async (
    addApkParams: string[],
    distributor: string,
    modelIds: string[],
    token: string,
): Promise<InsertApkListByCopyResponse> => {
    const req = new InsertApkListByCopyRequest({
        ids: addApkParams,
        distributorId: distributor,
        modelId: modelIds,
    });
    console.info("InsertApkListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.insertApkListByCopy(req, {
            headers: headers,
        });
        console.info("InsertApkListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertApkListByCopyResponse();
};
