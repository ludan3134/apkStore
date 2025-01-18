import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryApkCategoryLabelRequest, QueryApkCategoryLabelResponse} from "../../../../api/fs/v1/fs_pb";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";
import {ApkCategory} from "../../../../api/fs/v1/fm_pb";

export const grpcAllCategories = async (
    token: string,
    apkCategoryFilter: ApkCategory
): Promise<QueryApkCategoryLabelResponse> => {
    const req = new QueryApkCategoryLabelRequest({
        apkCategoryFilter: apkCategoryFilter
    });
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.queryApkCategoryLabel(req, {headers: headers});
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
    return new QueryApkCategoryLabelResponse();
};
