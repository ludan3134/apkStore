import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TVAsvClient} from "../../../../grpcClinet/grpcTVAsvClient";
import {UpdateServerGroupRequest, UpdateServerGroupResponse,} from "../../../../api/tv_as/v1/as_pb";
import {ServerGroup} from "../../../../api/tv_asm/v1/asm_pb";

export const grpcServerGroupEdit = async (
    ServerGroup: ServerGroup,
    token: string,
): Promise<UpdateServerGroupResponse> => {
    const req = new UpdateServerGroupRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        serverGroup: ServerGroup,
    });
    console.info("grpcTerminalEdit-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TVAsvClient.updateServerGroup(req, {headers: headers});
        console.info("grpcTerminalEdit-res", res);
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
    return new UpdateServerGroupResponse();
};
