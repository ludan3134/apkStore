import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {MacActivityStore} from "./model";
import {MacActivity, MacCityFilter} from "../../../../../api/ax/v1/axm_pb";

export const MacActivityStoreProxy = proxy<MacActivityStore>({
    MacActivityEdit: {} as MacActivity,
    MacActivitylist: [],
    MacActivityFilter: {} as MacCityFilter,
    MacActivitytableUrl: "",
});

export const useproxy_MacActivityEdit = () => {
    var MacActivitylistStore = useProxy(MacActivityStoreProxy);
    console.info(
        "调用useMacActivitylistRows,返回Rows列表:",
        MacActivitylistStore.MacActivityEdit,
    );
    return MacActivitylistStore.MacActivityEdit;
};
export const useproxy_MacActivityFilter = () => {
    var MacActivitylistStore = useProxy(MacActivityStoreProxy);
    console.info(
        "调用useMacActivitylistRows,返回Rows列表:",
        MacActivitylistStore.MacActivityFilter,
    );
    return MacActivitylistStore.MacActivityFilter;
};
export const useproxy_MacActivitytableUrl = () => {
    var MacActivitylistStore = useProxy(MacActivityStoreProxy);
    console.info(
        "调用useMacActivitylistRows,返回Rows列表:",
        MacActivitylistStore.MacActivitytableUrl,
    );
    return MacActivitylistStore.MacActivitytableUrl;
};
export const pre_MacActivitylistLoader = async () => {
    MacActivityStoreProxy.MacActivityFilter = {} as MacActivity
    return true;
};
