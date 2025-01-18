import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {InsertFirmwareDetailRequest, InsertFirmwareDetailResponse,} from "../../../../../api/fs/v1/fs_pb";
import {TVFsvClient} from "../../../../../grpcClinet/grpcTVFsvClient";
import {FirmwareDetail} from "../../../../../api/fs/v1/fm_pb";

export const grpcFirewareversionInsert = async (
    FirmwareDetail: FirmwareDetail,
    token: string,
): Promise<InsertFirmwareDetailResponse> => {
    const req = new InsertFirmwareDetailRequest({
        firmwareDetail: FirmwareDetail,
    });
    console.info("InsertFirmwareDetailRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.insertFirmwareDetail(req, {
            headers: headers,
        });
        console.info("InsertFirmwareDetailResponse-res", res);
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
    return new InsertFirmwareDetailResponse();
};
