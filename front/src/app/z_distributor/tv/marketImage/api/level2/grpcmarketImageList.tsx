import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryAppBannerListRequest, QueryAppBannerListResponse,} from "../../../../../../api/tv_fs/v1/fs_pb";
import {PageMeta} from "../../../../../../api/com/v1/pagemeta_pb";
import {AppBanner} from "../../../../../../api/tv_fs/v1/fm_pb";
import {TVFsvClient} from "../../../../../../grpcClinet/grpcTVFsvClient";

export const grpcmarketImageList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    appbanner: AppBanner,
): Promise<QueryAppBannerListResponse> => {
    const req = new QueryAppBannerListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        appBanner: appbanner,
        // backgroundFilter: backgroundFilterModel
    });
    console.info("grpcbackgroundList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.queryAppBannerList(req, {headers: headers});
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
    return new QueryAppBannerListResponse();
};
