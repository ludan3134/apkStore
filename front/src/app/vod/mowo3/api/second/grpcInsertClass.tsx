import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {ClassData} from "../../../../../api/ks/v1/km_pb";
import {InsertClassRequest, InsertClassResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";

export const grpcInsertClass = async (
    classData: ClassData,
    token: string,
): Promise<InsertClassResponse> => {
    const req = new InsertClassRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        class: classData,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.insertClass(req, {headers: headers});
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
    return new InsertClassResponse();
};
