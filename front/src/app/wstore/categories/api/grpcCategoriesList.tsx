import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {WsvClient} from "../../../../grpcClinet/grpcWsvClient";
import {QueryCategoriesListRequest, QueryCategoriesListResponse,} from "../../../../api/ws/v1/ws_pb";
import {Categories} from "../../../../api/ws/v1/wm_pb";

export const grpcCategoriesList = async (
    page: number,
    rowsPerPage: number,
    token: string,
    categoriessFilter: Categories,
): Promise<QueryCategoriesListResponse> => {
    const req = new QueryCategoriesListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        categoriesFilter: categoriessFilter,
    });
    console.info("grpcbackgroundList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await WsvClient.queryCategoriesList(req, {headers: headers});
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
    return new QueryCategoriesListResponse();
};
