import {LoginRequest, LoginResponse} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";

export const grpcLogin = async (
    userName: string,
    password: string,
): Promise<LoginResponse> => {
    const req = new LoginRequest({
        userName: userName,
        password: password,
    });
    console.info("grpcLogin-req", req);

    try {
        const res = await AxvClient.login(req);
        console.info("grpcLogin-res", res);
        if (res === undefined) {
            return res;
        }
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.error("error code", er1.code, "error message", er1.message);
    }
    return new LoginResponse();
};
