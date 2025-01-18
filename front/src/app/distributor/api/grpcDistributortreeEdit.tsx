import {ConnectError} from "@connectrpc/connect";
import {UpdateNotificationResponse} from "../../../api/fs/v1/fs_pb";
import {Distributor} from "../../../api/fs/v1/fm_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {UpdateDistributorRequest, UpdateDistributorResponse,} from "../../../api/ax/v1/ax_pb";
import {message} from "antd";

export const grpcDistributortreeEdit = async (
    distributor: Distributor,
    token: string,
): Promise<UpdateDistributorResponse> => {
    const req = new UpdateDistributorRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        distributor: distributor,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.updateDistributor(req, {headers: headers});
        console.info("grpcTerminalInsert-res", res);
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
    return new UpdateNotificationResponse();
};
