import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PullVodTop10ByDistributorRequest, PullVodTop10ByDistributorResponse} from "../../../../../api/ks/v1/ks_pb";
import {KsvClient} from "../../../../../grpcClinet/grpcKsvClient";


export const grpcPulldata = async (
    token: string,
    combId: number
): Promise<PullVodTop10ByDistributorResponse> => {
    const req = new PullVodTop10ByDistributorRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        comboId: combId
    });
    console.info("grpcAppsList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.pullVodTop10ByDistributor(req, {
            headers: headers,
        });
        console.info("grpcAppsList-res", res);
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
    return new PullVodTop10ByDistributorResponse();
};
