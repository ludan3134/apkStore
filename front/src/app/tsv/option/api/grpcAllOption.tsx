import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
import {QueryAllClassRequest, QueryAllClassResponse,} from "../../../../api/ta/v1/tas_pb";
import i18n from "../../../../i18n/i18n";

export const grpcAllOption = async (
    token: string,
): Promise<QueryAllClassResponse> => {
    var language = i18n.language;
    // 获取当前语言
    console.log("当前语言", language);
    const req = new QueryAllClassRequest({lang: language});
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.queryAllClass(req, {headers: headers});
        console.info("grpcTerminalInsert-res", res);
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
        console.error("error code", er1.code, "error message", er1.message);
    }
    return new QueryAllClassResponse();
};
