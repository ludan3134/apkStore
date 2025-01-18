// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
//
//
// export const grpcLanguageDelete = async (
//     LanguageIds: number[],
//     token: string
// ): Promise<DeleteRegionResponse> => {
//     const req = new DeleteRegionRequest({
//         transactionId: 6758n,
//         sessionId: 7769n,
//         RegionId: LanguageIds
//     });
//     console.info("grpcAccountEdit-req", req);
//     var headers = new Headers();
//     headers.set("token", token)
//     try {
//         const res = await TsvClient.deleteRegion(req, {headers: headers});
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
//     return new DeleteRegionResponse()
// };
