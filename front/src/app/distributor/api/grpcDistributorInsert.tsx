import {ConnectError} from "@connectrpc/connect";
import {Distributor} from "../../../api/fs/v1/fm_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {InsertDistributorRequest, InsertDistributorResponse,} from "../../../api/ax/v1/ax_pb";
import {message} from "antd";

export const grpcDistributorInsert = async (
    distributor: Distributor,
    token: string,
): Promise<InsertDistributorResponse> => {
    const req = new InsertDistributorRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        distributor: distributor,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.insertDistributor(req, {headers: headers});
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
    return new InsertDistributorResponse();
};
