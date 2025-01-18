import {QueryPlaybackListRequest, QueryPlaybackListResponse,} from "../../../../api/ks/v1/ks_pb";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {Playback} from "../../../../api/ks/v1/km_pb";

export const grpcPlaybacklist = async (
    page: number,
    rowsPerPage: number,
    Playbackfilter: Playback,
    token: string,
): Promise<QueryPlaybackListResponse> => {
    const req = new QueryPlaybackListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        playback: Playbackfilter,
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.queryPlaybackList(req, {headers: headers});
        console.info("grpcTerminalList-res", res);
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
    return new QueryPlaybackListResponse();
};
