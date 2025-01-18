import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../api/com/v1/pagemeta_pb";
import {QueryServerConfigListRequest, QueryServerConfigListResponse,} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";

export const grpcServerConfigList = async (
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryServerConfigListResponse> => {
    const req = new QueryServerConfigListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryServerConfigList(req, {
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
    return new QueryServerConfigListResponse();
};
