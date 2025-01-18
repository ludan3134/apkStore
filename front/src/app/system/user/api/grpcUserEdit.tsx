import {UpdateUserRequest, UpdateUserResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {ConnectError} from "@connectrpc/connect";
import {User} from "../../../../api/ax/v1/axm_pb";
import {message} from "antd";

export const grpcUserEdit = async (
    user: User,
    token: string,
): Promise<UpdateUserResponse> => {
    const req = new UpdateUserRequest({user: user});
    console.info("grpcUpdateUser-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.updateUser(req, {headers: headers});
        console.info("grpcUpdateUser-res", res);
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
    return new UpdateUserResponse();
};
