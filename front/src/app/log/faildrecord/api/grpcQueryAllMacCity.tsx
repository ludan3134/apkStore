import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {PageMeta} from "../../../../api/com/v1/pagemeta_pb";
import {QueryAllMacCityRequest, QueryAllMacCityResponse,} from "../../../../api/ax/v1/ax_pb";
import {AxvClient} from "../../../../grpcClinet/grpcAxvClient";
import {MacCityFilter} from "../../../../api/ax/v1/axm_pb";

export const grpcQueryAllMacCity = async (
    page: number,
    rowsPerPage: number,
    maccityfilter: MacCityFilter,
    token: string,
): Promise<QueryAllMacCityResponse> => {
    const req = new QueryAllMacCityRequest({
        pageMeta: new PageMeta({
            pageIndex: page,
            limit: rowsPerPage,
        }),
        macCityFilter: maccityfilter
    });
    console.info("grpcTerminalList-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await AxvClient.queryAllMacCity(req, {
            headers: headers,
        });
        console.info("grpcTerminalList-res", res);
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
    return new QueryAllMacCityResponse();
};
