import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";
import {InsertPortalRequest, InsertPortalResponse,} from "../../../../api/as/v1/as_pb";
import {PortalInfo} from "../../../../api/asm/v1/asm_pb";

export const grpcPortalInfoInsert = async (
    PortalInfo: PortalInfo,
    token: string,
): Promise<InsertPortalResponse> => {
    const req = new InsertPortalRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        portal: PortalInfo,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.insertPortal(req, {headers: headers});
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
    return new InsertPortalResponse();
};
