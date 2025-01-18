import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {Firmware} from "../../../../../api/fs/v1/fm_pb";
import {UpdateUserResponse} from "../../../../../api/ax/v1/ax_pb";
import {UpdateFirmwareRequest, UpdateFirmwareResponse,} from "../../../../../api/fs/v1/fs_pb";
import {FsvClient} from "../../../../../grpcClinet/grpcFsvClient";

export const grpcFirewareEdit = async (
    fireware: Firmware,
    token: string,
): Promise<UpdateUserResponse> => {
    const req = new UpdateFirmwareRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        firmware: fireware,
    });
    console.info("grpcfirmwareEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.updateFirmware(req, {headers: headers});
        console.info("grpcfirmwareEdit-res", res);
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
    return new UpdateFirmwareResponse();
};
