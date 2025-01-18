import {ConnectError} from "@connectrpc/connect";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {InsertModelRequest, InsertModelResponse,} from "../../../api/ax/v1/ax_pb";
import {Model} from "../../../api/ax/v1/axm_pb";
import {message} from "antd";

export const grpcModelnsert = async (
    model: Model,
    token: string,
): Promise<InsertModelResponse> => {
    const req = new InsertModelRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        model: model,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.insertModel(req, {headers: headers});
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
    return new InsertModelResponse();
};
