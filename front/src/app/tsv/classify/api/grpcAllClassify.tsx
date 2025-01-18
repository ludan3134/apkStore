import {ConnectError} from "@connectrpc/connect";
import {message} from "antd";
import {TsvClient} from "../../../../grpcClinet/grpcTsvClient";
import {QueryAllCategoryRequest, QueryAllCategoryResponse,} from "../../../../api/ta/v1/tas_pb";
import i18n from "../../../../i18n/i18n";

export const grpcAllClassify = async (
    classId: number,
    token: string,
): Promise<QueryAllCategoryResponse> => {
    var language = i18n.language;
    // 获取当前语言
    console.log("当前语言", language);
    const req = new QueryAllCategoryRequest({lang: language, classId: classId});
    console.info("grpcTerminalInsert-req", req);
    var headers = new Headers();
    headers.set("token", token);
    try {
        const res = await TsvClient.queryAllCategory(req, {headers: headers});
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
    return new QueryAllCategoryResponse();
};
