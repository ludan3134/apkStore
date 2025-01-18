// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {DeleteRecommendApkRequest, DeleteRecommendApkResponse} from "../../../../api/ks/v1/ks_pb";
// import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
//
//
// export const grpcRecommendDelete = async (
//     RecommendIds: number[],
//     token: string
// ): Promise<DeleteRecommendApkResponse> => {
//     const req = new DeleteRecommendApkRequest({
//         transactionId: 6758n,
//         sessionId: 7769n,
//         RecommendApkId: RecommendIds
//     });
//     console.info("grpcAccountEdit-req", req);
//     var headers = new Headers();
//     headers.set("token", token)
//     try {
//         const res = await TsvClient.deleteRecommendApk(req, {headers: headers});
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
//     return new DeleteRecommendApkResponse()
// };
