import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../grpcClinet/grpcWsvClient";
import {Categories} from "../../../../api/ws/v1/wm_pb";
import {InsertCategoriesRequest, InsertCategoriesResponse,} from "../../../../api/ws/v1/ws_pb";

export const grpcCategoriesInsert = async (
    addvertisementpicture: Categories,
    token: string,
): Promise<InsertCategoriesResponse> => {
    const req = new InsertCategoriesRequest({
        categories: addvertisementpicture,
    });
    console.info("InsertBackgroundListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.insertCategories(req, {headers: headers});
        console.info("InsertBackgroundListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertCategoriesResponse();
};
