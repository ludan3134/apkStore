import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {MainClass} from "../../../../../api/ks/v1/km_pb";
import {InsertMainClassRequest, InsertMainClassResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";

export const grpcfirstInsert = async (
    mainClass: MainClass,
    token: string,
): Promise<InsertMainClassResponse> => {
    const req = new InsertMainClassRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        mainClass: mainClass,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.insertMainClass(req, {headers: headers});
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
    return new InsertMainClassResponse();
};
