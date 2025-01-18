import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {FirmwareDetail} from "../../../../../api/fs/v1/fm_pb";
import {UpdateFirmwareDetailRequest, UpdateFirmwareDetailResponse,} from "../../../../../api/fs/v1/fs_pb";
import {TVFsvClient} from "../../../../../grpcClinet/grpcTVFsvClient";

export const grpcTVFirewareversionEdit = async (
    firmwareDetail: FirmwareDetail,
    token: string,
): Promise<UpdateFirmwareDetailResponse> => {
    const req = new UpdateFirmwareDetailRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        firmwareDetail: firmwareDetail,
    });
    console.info("grpcApkversionEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.updateFirmwareDetail(req, {
            headers: headers,
        });
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
    return new UpdateFirmwareDetailResponse();
};
