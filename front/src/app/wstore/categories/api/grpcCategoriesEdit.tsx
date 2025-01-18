import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../grpcClinet/grpcWsvClient";
import {UpdateCategoriesRequest, UpdateCategoriesResponse,} from "../../../../api/ws/v1/ws_pb";
import {Categories} from "../../../../api/ws/v1/wm_pb";

export const grpcCategoriesEdit = async (
    add: Categories,
    token: string,
): Promise<UpdateCategoriesResponse> => {
    const req = new UpdateCategoriesRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        categories: add,
    });
    console.info("grpcBackgroundEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.updateCategories(req, {headers: headers});
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
    return new UpdateCategoriesResponse();
};
