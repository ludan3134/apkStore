import {QueryAllModelRequest, QueryAllModelResponse,} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {ConnectError} from "@connectrpc/connect";

export const grpcAllModel = async (
    distributorId: string,
    token: string,
): Promise<QueryAllModelResponse> => {
    const req = new QueryAllModelRequest({
        distributorId: distributorId,
    });
    console.info("grpcDistributor-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryAllModel(req, {headers: headers});
        console.info("grpcDistributor-res", res);
        if (res === undefined) {
            return res;
        }
        if (res.status) {
            return res;
        }
    } catch (err) {
        if (err instanceof ConnectError) {
            console.info("grpcDistributor-res", err.message);
            // message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new QueryAllModelResponse();
};
