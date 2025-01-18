import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
import {UpdateClassRequest, UpdateClassResponse,} from "../../../../api/ta/v1/tas_pb";
import {ClassInfo} from "../../../../api/ta/v1/tam_pb";

export const grpcOptionEdit = async (
    Class: ClassInfo,
    token: string,
): Promise<UpdateClassResponse> => {
    const req = new UpdateClassRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        class: Class,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.updateClass(req, {headers: headers});
        console.info("grpcAccountEdit-res", res);
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
    return new UpdateClassResponse();
};
