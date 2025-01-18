import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {FsvClient} from "../../../../grpcClinet/grpcFsvClient";
import {DistributorDetail} from "../../../../api/fs/v1/fm_pb";
import {QueryDistributorDetailListRequest, QueryDistributorDetailListResponse,} from "../../../../api/fs/v1/fs_pb";

export const grpcDistributorDetailList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    DistributorDetailsFilter: DistributorDetail,
): Promise<QueryDistributorDetailListResponse> => {
    const req = new QueryDistributorDetailListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        distributorDetail: DistributorDetailsFilter,
    });
    console.info("grpcbackgroundList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.queryDistributorDetailList(req, {
            headers: headers,
        });
        console.info("grpcbackgroundList-res", res);
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
    return new QueryDistributorDetailListResponse();
};
