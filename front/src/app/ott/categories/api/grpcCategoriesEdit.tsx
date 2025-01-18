import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";
import {ApkCategory} from "../../../../api/fs/v1/fm_pb";
import {UpdateApkCategoryRequest, UpdateApkCategoryResponse,} from "../../../../api/fs/v1/fs_pb";

export const grpcApkCategoryEdit = async (
    add: ApkCategory,
    token: string,
): Promise<UpdateApkCategoryResponse> => {
    const req = new UpdateApkCategoryRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        apkCategory: add,
    });
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.updateApkCategory(req, {headers: headers});
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
    return new UpdateApkCategoryResponse();
};
