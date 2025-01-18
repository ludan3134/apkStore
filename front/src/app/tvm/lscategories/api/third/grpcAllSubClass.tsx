import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {
    QueryAllEpgRequest,
    QueryAllEpgResponse,
    QueryAllSubClassRequest,
    QueryAllSubClassResponse,
} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";

export const grpcAllSubClass = async (
    token: string,
    mainClassId:number
): Promise<QueryAllSubClassResponse> => {
    const req = new QueryAllSubClassRequest({mainClassId:mainClassId});
    console.info("grpcAllchannel-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryAllSubClass(req, {headers: headers});
        console.info("grpcAllchannel-res", res);
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
    return new QueryAllSubClassResponse();
};
