// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {DeleteAppsListRequest, DeleteAppsListResponse} from "../../../../../api/fs/v1/fs_pb";
// import {WsvClient} from "../../../../../grpcClinet/grpcWsvClient";
//
//
// export const grpcAppsDeletelist = async (
//     AppsIds: bigint[],
//     token: string
// ): Promise<DeleteAppsListResponse> => {
//     const req = new DeleteAppsListRequest({
//         transactionId: 6758n,
//         sessionId: 7769n,
//         AppsId: AppsIds
//     });
//     console.info("grpcAppsDeletelist-req", req);
//     var headers = new Headers();
//     headers.set("token", token)
//     try {
//         const res = await WsvClient.deleteAppsList(req, {headers: headers});
//         console.info("grpcAppsDeletelist-res", res);
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
//     return new DeleteAppsListResponse()
// };
