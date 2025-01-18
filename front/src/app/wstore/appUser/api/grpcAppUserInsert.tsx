import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {WsvClient} from "../../../../grpcClinet/grpcWsvClient";
import {AppUser} from "../../../../api/ws/v1/wm_pb";
import {InsertAppUserRequest, InsertAppUserResponse,} from "../../../../api/ws/v1/ws_pb";

export const grpcAppUserInsert = async (
    appUser: AppUser,
    token: string,
): Promise<InsertAppUserResponse> => {
    const req = new InsertAppUserRequest({
        appUser: appUser,
    });
    console.info("InsertAppUserRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.insertAppUser(req, {headers: headers});
        console.info("InsertBackgroundListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertAppUserResponse();
};
