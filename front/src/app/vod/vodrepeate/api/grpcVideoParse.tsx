// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
// import {ParseYoutubeRequest, ParseYoutubeResponse} from "../../../../api/ta/v1/tas_pb";
//
//
// export const grpcVodRepeatedParse = async (
//     language: string,
//     VodRepeatedId: string,
//     token: string
// ): Promise<ParseYoutubeResponse> => {
//     const req = new ParseYoutubeRequest({
//         transactionId: 6758n,
//         sessionId: 7769n,
//         VodRepeatedId: VodRepeatedId,
//         language: language,
//     });
//     console.info("grpcAccountEdit-req", req);
//     var headers = new Headers();
//     headers.set("token", token)
//     try {
//         const res = await KsvClient.parseYoutube(req, {headers: headers});
//         console.info("grpcAccountEdit-res", res);
//         if (res === undefined) {
//             return res
//         }
//         if (res.status) {
//             return res
//         }
//     } catch (err) {
//         if (err instanceof ConnectError) {
//             message.error(err.message)
//         }
//         const er1 = ConnectError.from(err);
//         console.error("error code", er1.code, "error message", er1.message);
//     }
//     return new ParseYoutubeResponse()
// };
