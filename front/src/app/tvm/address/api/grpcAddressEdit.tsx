import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {UpdateAddressConfigRequest, UpdateAddressConfigResponse,} from "../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
import {AddressConfig} from "../../../../api/ks/v1/km_pb";

export const grpcAddressEdit = async (
    address: AddressConfig,
    token: string,
): Promise<UpdateAddressConfigResponse> => {
    const req = new UpdateAddressConfigRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        addressConfig: address,
    });
    console.info("grpcAccountEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.updateAddressConfig(req, {headers: headers});
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
    return new UpdateAddressConfigResponse();
};
