import {ConnectError} from "@connectrpc/connect";
import {authProxy} from "../../auth/store/store";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {QueryAllModelRequest, QueryAllModelResponse,} from "../../../api/ax/v1/ax_pb";
import {message} from "antd";

export const grpcAllModel = async (): Promise<QueryAllModelResponse> => {
    const req = new QueryAllModelRequest({});
    console.info("grpcDistributorToModel-req", req);
    var headers = new Headers();
    headers.set("token", authProxy.token);
    try {
        const res = await AxvClient.queryAllModel(req, {headers: headers});
        console.info("grpcDistributorToModel-res", res);
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
    return new QueryAllModelResponse();
};
