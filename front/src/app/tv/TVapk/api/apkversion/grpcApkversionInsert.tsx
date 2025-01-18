import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {ApkDetail} from "../../../../../api/fs/v1/fm_pb";
import {InsertApkDetailRequest, InsertApkDetailResponse,} from "../../../../../api/fs/v1/fs_pb";
import {TVFsvClient} from "../../../../../grpcClinet/grpcTVFsvClient";

export const grpcApkversionInsert = async (
    apkDetail: ApkDetail,
    token: string,
): Promise<InsertApkDetailResponse> => {
    const req = new InsertApkDetailRequest({apkDetail: apkDetail});
    console.info("InsertApkDetailRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.insertApkDetail(req, {headers: headers});
        console.info("InsertApkDetailResponse-res", res);
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
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertApkDetailResponse();
};
