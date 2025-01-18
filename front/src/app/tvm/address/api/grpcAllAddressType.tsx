import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryAllAddressTypeRequest, QueryAllAddressTypeResponse,} from "../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";

export const grpcAllAddressType = async (
    token: string,
): Promise<QueryAllAddressTypeResponse> => {
    const req = new QueryAllAddressTypeRequest({
        transactionId: 6758n,
        sessionId: 7769n,
    });
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryAllAddressType(req, {
            headers: headers,
        });
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
    return new QueryAllAddressTypeResponse();
};
