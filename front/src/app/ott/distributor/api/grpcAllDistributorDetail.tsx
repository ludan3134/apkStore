// import {ConnectError} from "@connectrpc/connect";
// import {message} from "antd";
// import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";
//
// export const grpcAllDistributorDetail = async (
//     token: string,
// ): Promise<QueryAllDistributorDetailResponse> => {
//     const req = new QueryAllDistributorDetailRequest({});
//     console.info("grpcBackgroundEdit-req", req);
//     var headers = new Headers();
//     headers.set("token", token);
//     try {
//         const res = await FsvClient.queryAllDistributorDetail(req, {headers: headers});
//         console.info("grpcBackgroundEdit-res", res);
//         if (res === undefined) {
//             return res;
//         }
//         if (res.status) {
//             return res;
//         }
//     } catch (err) {
//         if (err instanceof ConnectError) {
//             message.error(err.message);
//         }
//         const er1 = ConnectError.from(err);
//         console.error("error code", er1.code, "error message", er1.message);
//     }
//     return new QueryAllDistributorDetailResponse();
// };
