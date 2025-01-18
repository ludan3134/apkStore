import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryBindDistributorModelRequest, QueryBindDistributorModelResponse,} from "../../../api/ta/v1/tas_pb";
import {TsvClient} from "../../../grpcClinet/grpcTsvClient";

export const grpcQueryBindDistributorModelList = async (
    queryType: number,
    id: number,
    token: string,
): Promise<QueryBindDistributorModelResponse> => {
    const req = new QueryBindDistributorModelRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        queryType: queryType,
        id: id,
    });
    console.info("grpcAccountList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.queryBindDistributorModel(req, {
            headers: headers,
        });
        console.info("grpcAccountList-res", res);
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
    return new QueryBindDistributorModelResponse();
};
