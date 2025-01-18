import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {HomeBackgroundImage} from "../../../../api/fs/v1/fm_pb";
import {QueryHomeBackgroundImageListRequest, QueryHomeBackgroundImageListResponse,} from "../../../../api/fs/v1/fs_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";

export const grpcbackgroundList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    homebakground: HomeBackgroundImage,
): Promise<QueryHomeBackgroundImageListResponse> => {
    const req = new QueryHomeBackgroundImageListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        homeBackgroundImage: homebakground,
        // backgroundFilter: backgroundFilterModel
    });
    console.info("grpcbackgroundList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.queryHomeBackgroundImageList(req, {
            headers: headers,
        });
        console.info("grpcbackgroundList-res", res);
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
    return new QueryHomeBackgroundImageListResponse();
};
