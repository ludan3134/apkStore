import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {QueryProvideTemplateListRequest, QueryProvideTemplateListResponse,} from "../../../../../../api/tv_fs/v1/fs_pb";
import {FsvClient} from "../../../../../../grpcClinet/grpcFsvClient";
import {PageMeta} from "../../../../../../api/com/v1/pagemeta_pb";

export const grpcQueryProvideTemplatelist = async (
    page: number,
    rowsPerPage: number,
    token: string,
): Promise<QueryProvideTemplateListResponse> => {
    const req = new QueryProvideTemplateListRequest({
        transactionId: 6758n,
        sessionId: 7769n,
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
    });
    console.info("grpcAppsList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await FsvClient.queryProvideTemplateList(req, {
            headers: headers,
        });
        console.info("grpcAppsList-res", res);
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
    return new QueryProvideTemplateListResponse();
};
