import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {InsertLotRequest, InsertLotResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";
import {Lot} from "../../../../api/asm/v1/asm_pb";

export const grpcLotInsert = async (
    Lot: Lot,
    token: string,
): Promise<InsertLotResponse> => {
    const req = new InsertLotRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        lot: Lot,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.insertLot(req, {headers: headers});
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
    return new InsertLotResponse();
};
