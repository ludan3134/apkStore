import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {QueryAllLotRequest, QueryAllLotResponse,} from "../../../../api/as/v1/as_pb";
import {AsvClient} from "../../../../grpcClinet/grpcAsvClient";

export const grpcAllLot = async (
    distributorId: string,
    token: string,
): Promise<QueryAllLotResponse> => {
    const req = new QueryAllLotRequest({
        distributorId: distributorId,
    });
    console.info("grpcDistributor-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AsvClient.queryAllLot(req, {headers: headers});
        console.info("grpcDistributor-res", res);
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
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new QueryAllLotResponse();
};
