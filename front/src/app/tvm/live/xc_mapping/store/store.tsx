import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {XStreamStore} from "./model";
import {XstreamResource} from "../../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../../auth/store/store";
import {grpcXstreamsource} from "../api/grpcXstreamsource";

export const XStreamStoreProxy = proxy<XStreamStore>({
    XStreamEdit: {} as XstreamResource,
    XStreamlist: [],
    XStreamFilter: {} as XstreamResource,
    XStreamtableUrl: "",
    allXstream: [],
});

export const useproxy_XStreamEdit = () => {
    var XStreamlistStore = useProxy(XStreamStoreProxy);
    console.info(
        "调用useXStreamlistRows,返回Rows列表:",
        XStreamlistStore.XStreamEdit,
    );
    return XStreamlistStore.XStreamEdit;
};
export const useproxy_XStreamFilter = () => {
    var XStreamlistStore = useProxy(XStreamStoreProxy);
    console.info(
        "调用useXStreamlistRows,返回Rows列表:",
        XStreamlistStore.XStreamFilter,
    );
    return XStreamlistStore.XStreamFilter;
};
export const useproxy_XStreamtableUrl = () => {
    var XStreamlistStore = useProxy(XStreamStoreProxy);
    console.info(
        "调用useXStreamlistRows,返回Rows列表:",
        XStreamlistStore.XStreamtableUrl,
    );
    return XStreamlistStore.XStreamtableUrl;
};
export const useproxy_allXstream = () => {
    var XStreamlistStore = useProxy(XStreamStoreProxy);
    console.info(
        "调用useXStreamlistRows,返回Rows列表:",
        XStreamlistStore.XStreamtableUrl,
    );
    return XStreamlistStore.allXstream;
};
export const initialXStreamParams: XstreamResource = {
    id: 0,
    name: "",
};
export const pre_XStreamlistLoader = async () => {
    var permissions = authProxy.permissions;
    var XStreamTable = permissions.find(
        (option) => option.name === "查找XC映射资源",
    );
    XStreamStoreProxy.XStreamtableUrl = `${XStreamTable?.url}/${XStreamTable?.id}`;
    var res = await grpcXstreamsource();
    XStreamStoreProxy.allXstream = res.xstreamResourceList;
    return true;
};
