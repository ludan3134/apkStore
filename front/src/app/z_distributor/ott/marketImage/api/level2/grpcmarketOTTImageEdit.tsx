import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {AppBanner} from "../../../../../../api/tv_fs/v1/fm_pb";
import {UpdateAppBannerRequest, UpdateAppBannerResponse,} from "../../../../../../api/tv_fs/v1/fs_pb";
import {FsvClient} from "../../../../../../grpcClinet/grpcFsvClient";

export const grpcmarketOTTImageEdit = async (
    appBanner: AppBanner,
    token: string,
): Promise<UpdateAppBannerResponse> => {
    const req = new UpdateAppBannerRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        appBanner: appBanner,
    });
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        debugger
        const res = await FsvClient.updateAppBanner(req, {headers: headers});
        console.info("grpcBackgroundEdit-res", res);
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
        console.error("error code", er1.code, "error message", er1.message);
    }
    return new UpdateAppBannerResponse();
};
