import {ConnectError} from "@connectrpc/connect";

import {message} from "antd";
import {AdvertisementPicture} from "../../../../api/fs/v1/fm_pb";
import {
    QueryAdvertisementPictureListRequest,
    QueryAdvertisementPictureListResponse,
} from "../../../../api/tv_fs/v1/fs_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {TVFsvClient} from "../../../../grpcClinet/grpcTVFsvClient";

export const grpcTVDeskImageList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    advertisementFilter: AdvertisementPicture,
): Promise<QueryAdvertisementPictureListResponse> => {
    const req = new QueryAdvertisementPictureListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        advertisementPicture: advertisementFilter,
        // backgroundFilter: backgroundFilterModel
    });
    console.info("grpcbackgroundList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.queryAdvertisementPictureList(req, {
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
    return new QueryAdvertisementPictureListResponse();
};
