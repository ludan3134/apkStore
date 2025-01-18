import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {QueryFirmwareListRequest, QueryFirmwareListResponse,} from "../../../../../api/fs/v1/fs_pb";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {TVFsvClient} from "../../../../../grpcClinet/grpcTVFsvClient";

export const grpcFirewareList = async (
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryFirmwareListResponse> => {
    const req = new QueryFirmwareListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
    });
    console.info("grpcFirmwareList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.queryFirmwareList(req, {headers: headers});
        console.info("grpcFirmwareList-res", res);
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
    return new QueryFirmwareListResponse();
};
