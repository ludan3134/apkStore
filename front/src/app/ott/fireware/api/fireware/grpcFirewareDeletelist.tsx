import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {DeleteApkListRequest, DeleteApkListResponse,} from "../../../../../api/fs/v1/fs_pb";
import {FsvClient} from "../../../../../grpcClinet/grpcFsvClient";

export const grpcFirewareDeletelist = async (
    apkIds: bigint[],
    token: string,
): Promise<DeleteApkListResponse> => {
    const req = new DeleteApkListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        apkId: apkIds,
    });
    console.info("grpcApkDeletelist-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.deleteApkList(req, {headers: headers});
        console.info("grpcApkDeletelist-res", res);
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
    return new DeleteApkListResponse();
};
