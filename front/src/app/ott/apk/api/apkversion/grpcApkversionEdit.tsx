import {ConnectError} from "@connectrpc/connect";
import {ApkDetail} from "../../../../../api/fs/v1/fm_pb";
import {UpdateApkDetailRequest, UpdateApkDetailResponse,} from "../../../../../api/fs/v1/fs_pb";
import {FsvClient} from "../../../../../grpcClinet/grpcFsvClient";
import {message} from "antd";

export const grpcApkversionEdit = async (
    apkversionDetail: ApkDetail,
    token: string,
): Promise<UpdateApkDetailResponse> => {
    const req = new UpdateApkDetailRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        apkDetail: apkversionDetail,
    });
    console.info("grpcApkversionEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.updateApkDetail(req, {headers: headers});
        console.info("grpcApkEdit-res", res);
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
    return new UpdateApkDetailResponse();
};
