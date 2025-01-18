import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {FsvClient} from "../../../../../../grpcClinet/grpcFsvClient";
import {DeleteProvideTemplateRequest, DeleteProvideTemplateResponse} from "../../../../../../api/fs/v1/fs_pb";

export const grpcDeleteProvideTemplate = async (
    id: number,
    token: string,
): Promise<DeleteProvideTemplateResponse> => {
    const req = new DeleteProvideTemplateRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        id: id,
    });
    console.info("grpcAppsEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.deleteProvideTemplate(req, {
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
    return new DeleteProvideTemplateResponse();
};
