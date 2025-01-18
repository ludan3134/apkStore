import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {AppBanner} from "../../../../../../api/tv_fs/v1/fm_pb";
import {InsertAppBannerRequest, InsertAppBannerResponse,} from "../../../../../../api/tv_fs/v1/fs_pb";
import {FsvClient} from "../../../../../../grpcClinet/grpcFsvClient";

export const grpcmarketImageInsert = async (
    appBanners: AppBanner[],
    token: string,
): Promise<InsertAppBannerResponse> => {
    const req = new InsertAppBannerRequest({
        appBanner: appBanners,
    });
    console.info("InsertBackgroundListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.insertAppBanner(req, {headers: headers});
        console.info("InsertBackgroundListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertAppBannerResponse();
};
