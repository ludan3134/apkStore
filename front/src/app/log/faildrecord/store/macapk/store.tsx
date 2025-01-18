import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {MacApkStore} from "./model";
import {MacApk} from "../../../../../api/ax/v1/axm_pb";

export const MacApkStoreProxy = proxy<MacApkStore>({
    MacApkEdit: {} as MacApk,
    MacApklist: [],
    MacApkFilter: {} as MacApk,
    MacApktableUrl: "",
});

export const useproxy_MacApkEdit = () => {
    var MacApklistStore = useProxy(MacApkStoreProxy);
    console.info(
        "调用useMacApklistRows,返回Rows列表:",
        MacApklistStore.MacApkEdit,
    );
    return MacApklistStore.MacApkEdit;
};
export const useproxy_MacApkFilter = () => {
    var MacApklistStore = useProxy(MacApkStoreProxy);
    console.info(
        "调用useMacApklistRows,返回Rows列表:",
        MacApklistStore.MacApkFilter,
    );
    return MacApklistStore.MacApkFilter;
};
export const useproxy_MacApktableUrl = () => {
    var MacApklistStore = useProxy(MacApkStoreProxy);
    console.info(
        "调用useMacApklistRows,返回Rows列表:",
        MacApklistStore.MacApktableUrl,
    );
    return MacApklistStore.MacApktableUrl;
};
export const initialMacApkParams: MacApk = {};
export const initialMacApkfilterParams: MacApk = {};
export const pre_MacApklistLoader = async () => {
    MacApkStoreProxy.MacApkFilter = {} as MacApk
    return true;
};
