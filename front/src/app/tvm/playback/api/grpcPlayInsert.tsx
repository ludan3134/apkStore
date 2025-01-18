import {Playback} from "../../../../api/ks/v1/km_pb";
import {InsertPlaybackRequest, InsertPlaybackResponse,} from "../../../../api/ks/v1/ks_pb";
import {ConnectError} from "@connectrpc/connect";
import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
import {message} from "antd";

export const grpcPlaybackInsert = async (
    addEvent: Playback,
    token: string,
): Promise<InsertPlaybackResponse> => {
    const req = new InsertPlaybackRequest({
        playback: addEvent,
    });
    console.info("InsertAddListRequest-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await KsvClient.insertPlayback(req, {headers: headers});
        console.info("InsertAddListResponse-res", res);
        return res;
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new InsertPlaybackResponse();
};
