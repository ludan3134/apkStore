import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {UpdateRecommendApkRequest, UpdateRecommendApkResponse,} from "../../../../api/fs/v1/fs_pb";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";
import {RecommendApk} from "../../../../api/fs/v1/fm_pb";

export const grpcRecommendApkEdit = async (
    Recommend: RecommendApk,
    token: string,
): Promise<UpdateRecommendApkResponse> => {
    const req = new UpdateRecommendApkRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        recommendApk: Recommend,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.updateRecommendApk(req, {headers: headers});
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
    return new UpdateRecommendApkResponse();
};
