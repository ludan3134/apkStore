// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {KsvClient} from "../../../../grpcClinet/grpcKsvClient";
//
//
// export const grpcVodRepeatedInsert = async (
//     VodRepeated: VodRepeated,
//     token: string
// ): Promise<InsertVodRepeatedResponse> => {
//     const req = new InsertVodRepeatedRequest({
//         transactionId: 6758n,
//         sessionId: 7769n,
//         VodRepeated: VodRepeated
//     });
//     console.info("grpcAccountEdit-req", req);
//     var headers = new Headers();
//     headers.set("token", token)
//     try {
//         const res = await KsvClient.insertVodRepeated(req, {headers: headers});
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
//     return new InsertVodRepeatedResponse()
// };
