import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {UpdateTerminalInfoListStatusRequest, UpdateTerminalInfoListStatusResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcTerminalUpdateAll = async (
    distributorId: string | undefined,
    lotId: string,
    isActive: boolean,
    isService: boolean,
    isAuth: boolean,
    token: string,
): Promise<UpdateTerminalInfoListStatusResponse> => {
    const req = new UpdateTerminalInfoListStatusRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        distributorId: distributorId,
        lotId: lotId,
        setActive: isActive,
        setService: isService,
        storeAuth: isAuth,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.updateTerminalInfoListStatus(req, {
            headers: headers,
        });
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
    return new UpdateTerminalInfoListStatusResponse();
};
