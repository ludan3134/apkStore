import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TVFsvClient} from "../../../../../../grpcClinet/grpcTVFsvClient";
import {ProvideTemplate} from "../../../../../../api/tv_fs/v1/fm_pb";
import {UpdateProvideTemplateRequest, UpdateProvideTemplateResponse,} from "../../../../../../api/tv_fs/v1/fs_pb";

export const grpcUpdateProvideTemplate = async (
    provideTemplate: ProvideTemplate,
    token: string,
): Promise<UpdateProvideTemplateResponse> => {
    const req = new UpdateProvideTemplateRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        provideTemplate: provideTemplate,
    });
    console.info("grpcAppsEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVFsvClient.updateProvideTemplate(req, {
            headers: headers,
        });
        console.info("grpcAppsEdit-res", res);
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
    return new UpdateProvideTemplateResponse();
};
