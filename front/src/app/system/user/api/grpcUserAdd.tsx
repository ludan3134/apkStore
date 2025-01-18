import {InsertUserRequest, InsertUserResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";

export const grpcUserAdd = async (
    userName: string,
    password: string,
    token: string,
): Promise<InsertUserResponse> => {
    const req = new InsertUserRequest({
        userName: userName,
        password: password,
        roleId: 99,
    });
    console.info("grpcAddUser-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.insertUser(req, {headers: headers});
        console.info("grpcAddUser-res", res);
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
    return new InsertUserResponse();
};
