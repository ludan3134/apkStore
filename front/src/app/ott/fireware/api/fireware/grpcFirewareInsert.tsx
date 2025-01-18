import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {InsertFirmwareRequest, InsertFirmwareResponse,} from "../../../../../api/fs/v1/fs_pb";
import {Firmware} from "../../../../../api/fs/v1/fm_pb";
import {FsvClient} from "../../../../../grpcClinet/grpcFsvClient";

export const grpcFirewareInsert = async (
    addFirmwareParams: Firmware,
    token: string,
): Promise<InsertFirmwareResponse> => {
    const req = new InsertFirmwareRequest({
        firmware: addFirmwareParams,
    });
    console.info("InsertFirmwareListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.insertFirmware(req, {headers: headers});
        console.info("InsertFirmwareListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertFirmwareResponse();
};
