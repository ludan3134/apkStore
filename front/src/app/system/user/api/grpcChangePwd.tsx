import {ChangePwdRequest, ChangePwdResponse, ResetPwdResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";

export const grpcChangePwd = async (
    oldPwd: string,
    newPwd: string,
    token: string,
): Promise<ChangePwdResponse> => {
    const req = new ChangePwdRequest({
        oldPwd: oldPwd,
        newPwd: newPwd,
    });
    console.info("grpcUpdateUser-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.changePwd(req, {headers: headers});
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
    return new ResetPwdResponse();
};
