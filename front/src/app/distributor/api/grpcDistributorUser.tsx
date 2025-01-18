import {ConnectError} from "@connectrpc/connect";
import {QueryUserDistributorRequest, QueryUserDistributorResponse,} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {message} from "antd";

export const grpcDistributorUser = async (
    distributorId: string,
    token: string,
): Promise<QueryUserDistributorResponse> => {
    const req = new QueryUserDistributorRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        distributorId: distributorId,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryUserDistributor(req, {headers: headers});
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
    return new QueryUserDistributorResponse();
};
