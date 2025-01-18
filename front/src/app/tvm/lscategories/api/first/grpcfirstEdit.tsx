import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {UpdateMainClassRequest, UpdateMainClassResponse,} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";
import {MainClass} from "../../../../../api/ks/v1/km_pb";

export const grpcfirstEdit = async (
    mainClass: MainClass,
    token: string,
): Promise<UpdateMainClassResponse> => {
    const req = new UpdateMainClassRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        mainClass: mainClass,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.updateMainClass(req, {headers: headers});
        console.info("grpcTerminalEdit-res", res);
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
    return new UpdateMainClassResponse();
};
