import {UserMenuInfoRequest, UserMenuInfoResponse,} from "../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";

export const grpcUserMenuInfo = async (
    token: string,
): Promise<UserMenuInfoResponse> => {
    const req = new UserMenuInfoRequest();
    console.info("grpcUserMenuInfo-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.userMenuInfo(req, {headers: headers});
        console.info("grpcUserMenuInfo-res", res);
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
    return new UserMenuInfoResponse();
};
