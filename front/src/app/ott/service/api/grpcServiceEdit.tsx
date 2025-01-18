import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PortalInfo} from "../../../../api/asm/v1/asm_pb";
import {UpdatePortalRequest, UpdatePortalResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcPortalInfoEdit = async (
    PortalInfo: PortalInfo,
    token: string,
): Promise<UpdatePortalResponse> => {
    const req = new UpdatePortalRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        portal: PortalInfo,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.updatePortal(req, {headers: headers});
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
    return new UpdatePortalResponse();
};
