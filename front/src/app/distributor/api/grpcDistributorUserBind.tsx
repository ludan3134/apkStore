import {ConnectError} from "@connectrpc/connect";
import {UpdateUserDistributorRequest, UpdateUserDistributorResponse,} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {message} from "antd";

export const grpcDistributorUserBind = async (
    distributorId: string,
    user: [],
    token: string,
): Promise<UpdateUserDistributorResponse> => {
    const req = new UpdateUserDistributorRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        distributorId: distributorId,
        userIds: user,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.updateUserDistributor(req, {
            headers: headers,
        });
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
    return new UpdateUserDistributorResponse();
};
