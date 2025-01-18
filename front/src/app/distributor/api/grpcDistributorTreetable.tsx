import {ConnectError} from "@connectrpc/connect";
import {authProxy} from "../../auth/store/store";
import {AxvClient} from "../../../grpcClinet/grpcAxvClient";
import {QueryDistributorListRequest, QueryDistributorListResponse,} from "../../../api/ax/v1/ax_pb";
import {PageMeta} from "../../../api/com/v1/pagemeta_pb";
import {message} from "antd";

export const grpcDistributorTreetable = async (
    page: number,
    rowsPerPage: number,
    title: string,
    token: string,
): Promise<QueryDistributorListResponse> => {
    const req = new QueryDistributorListRequest({
        distributorId: title,
        pageMeta: new PageMeta({
            pageIndex: page - 1,
            limit: rowsPerPage,
        }),
    });
    console.info("grpcDistributorToModel-req", req);
    var headers = new Headers();
    headers.set("token", authProxy.token);
    try {
        const res = await AxvClient.queryDistributorList(req, {headers: headers});
        console.info("grpcDistributorToModel-res", res);
        if (res === undefined) {
            return res;
        }
        if (res.status) {
            return res;
        }
    } catch (err) {
        if (err instanceof ConnectError) {
            message.error(err.message);
        }
        const er1 = ConnectError.from(err);
        console.log("error code", er1.code, "error message", er1.message);
    }
    return new QueryDistributorListResponse();
};
