// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {DeleteClassRequest, DeleteClassResponse} from "../../../../api/ks/v1/ks_pb";
// import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
//
//
// export const grpcOptionDelete = async (
//     ClassIds: number[],
//     token: string
// ): Promise<DeleteClassResponse> => {
//     const req = new DeleteClassRequest({
//         transactionId: 6758n,
//         sessionId: 7769n,
//         ClassId: ClassIds
//     });
//     console.info("grpcAccountEdit-req", req);
//     var headers = new Headers();
//     headers.set("token", token)
//     try {
//         const res = await TsvClient.deleteClass(req, {headers: headers});
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
//     return new DeleteClassResponse()
// };
