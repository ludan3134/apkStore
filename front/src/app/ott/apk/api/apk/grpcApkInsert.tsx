import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {Apk} from "../../../../../api/fs/v1/fm_pb";
import {InsertApkRequest, InsertApkResponse,} from "../../../../../api/fs/v1/fs_pb";
import {FsvClient} from "../../../../../grpcClinet/grpcFsvClient";

export const grpcApkInsert = async (
    addApkParams: Apk,
    token: string,
): Promise<InsertApkResponse> => {
    const req = new InsertApkRequest({
        apk: addApkParams,
    });
    console.info("InsertApkListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.insertApk(req, {headers: headers});
        console.info("InsertApkListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertApkResponse();
};
