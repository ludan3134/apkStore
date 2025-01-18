import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {QueryFirmwareDetailListRequest, QueryFirmwareDetailListResponse,} from "../../../../../api/fs/v1/fs_pb";
import {PageMeta} from "../../../../../api/com/v1/pagemeta_pb";
import {FsvClient} from "../../../../../grpcClinet/grpcFsvClient";

export const grpcFirewareversionList = async (
    firmwareId: string,
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryFirmwareDetailListResponse> => {
    const req = new QueryFirmwareDetailListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        firmwareId: firmwareId,
    });
    console.info("grpcFirmwareVersionList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.queryFirmwareDetailList(req, {
            headers: headers,
        });
        console.info("grpcFirmwareVersionList-res", res);
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
    return new QueryFirmwareDetailListResponse();
};
