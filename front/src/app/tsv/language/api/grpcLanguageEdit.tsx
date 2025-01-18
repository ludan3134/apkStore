// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {UpdateRegionRequest, UpdateRegionResponse} from "../../../../api/ks/v1/ks_pb";
// import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
// import {Region} from "../../../../api/ks/v1/km_pb";
//
//
// export const grpcLanguageEdit = async (
//     Language: Region,
//     token: string
// ): Promise<UpdateRegionResponse> => {
//     const req = new UpdateRegionRequest({
//         transactionId: 6758n,
//         sessionId: 7769n,
//         Region: Language
//     });
//     console.info("grpcAccountEdit-req", req);
//     var headers = new Headers();
//     headers.set("token", token)
//     try {
//         const res = await TsvClient.updateRegion(req, {headers: headers});
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
//     return new UpdateRegionResponse()
// };
