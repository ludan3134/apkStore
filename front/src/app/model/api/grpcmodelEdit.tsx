import {ConnectError} from "@connectrpc/connect";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {UpdateModelRequest, UpdateModelResponse,} from "../../../api/ax/v1/ax_pb";
import {message} from "antd";
import {Model} from "../../../api/ax/v1/axm_pb";

export const grpcmodelEdit = async (
    model: Model,
    token: string,
): Promise<UpdateModelResponse> => {
    const req = new UpdateModelRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        model: model,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.updateModel(req, {headers: headers});
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
    return new UpdateModelResponse();
};
