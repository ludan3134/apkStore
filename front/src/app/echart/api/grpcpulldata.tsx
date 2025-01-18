import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {MacActivityFilter} from "../../../api/ax/v1/axm_pb";
import {QueryActivityListRequest, QueryActivityListResponse} from "../../../api/ax/v1/ax_pb";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";


export const grpcpulldata = async (
    macactivityfilter: MacActivityFilter,
    token: string,
): Promise<QueryActivityListResponse> => {
    const req = new QueryActivityListRequest({
        macActivityFilter: macactivityfilter,
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryActivityList(req, {
            headers: headers,
        });
        console.info("grpcTerminalList-res", res);
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
    return new QueryActivityListResponse();
};
