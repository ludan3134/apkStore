// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {Region} from "../../../../api/ks/v1/km_pb";
// import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
// import {InsertRegionRequest, InsertRegionResponse} from "../../../../api/ks/v1/ks_pb";
//
//
// export const grpcLanguageInsert = async (
//     Language: Region,
//     token: string
// ): Promise<InsertRegionResponse> => {
//     const req = new InsertRegionRequest({
//         transactionId: 6758n,
//         sessionId: 7769n,
//         Region: Language
//     });
//     console.info("grpcAccountEdit-req", req);
//     var headers = new Headers();
//     headers.set("token", token)
//     try {
//         const res = await TsvClient.insertRegion(req, {headers: headers});
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
//     return new InsertRegionResponse()
// };
