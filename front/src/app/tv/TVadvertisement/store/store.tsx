import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVAddStore} from "./model";
import {Advertisement} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";

export const TVAddStoreProxy = proxy<TVAddStore>({
    TVAddEdit: {} as Advertisement,
    TVAddlist: [],
    TVAddFilter: {} as Advertisement,
    TVAddtableUrl: "",
});

export const useproxy_TVAddEdit = () => {
    var TVAddlistv_tv_fstore = useProxy(TVAddStoreProxy);
    console.info(
        "调用useTVAddlistRows,返回Rows列表:",
        TVAddlistv_tv_fstore.TVAddEdit,
    );
    return TVAddlistv_tv_fstore.TVAddEdit;
};
export const useproxy_TVAddFilter = () => {
    var TVAddlistv_tv_fstore = useProxy(TVAddStoreProxy);
    console.info(
        "调用useTVAddlistRows,返回Rows列表:",
        TVAddlistv_tv_fstore.TVAddFilter,
    );
    return TVAddlistv_tv_fstore.TVAddFilter;
};
export const useproxy_TVAddtableUrl = () => {
    var TVAddlistv_tv_fstore = useProxy(TVAddStoreProxy);
    console.info(
        "调用useTVAddlistRows,返回Rows列表:",
        TVAddlistv_tv_fstore.TVAddtableUrl,
    );
    return TVAddlistv_tv_fstore.TVAddtableUrl;
};
export const initialTVAddParams: Advertisement = {
    id: "",
    name: "",
    playTime: "",
    version: "",
    md5: "",
    url: "",
    content: "",
    modelId: "",
    type: "",
    modelName: "",
    distributorName: "",
};
export const initialTVAddfilterParams: Advertisement = {
    id: "",
    name: "",
    playTime: "",
    version: "",
    md5: "",
    url: "",
    content: "",
    modelId: "",
    type: "",
    modelName: "",
    distributorName: "",
};
export const pre_TVAddlistLoader = async () => {
    var permissions = authProxy.permissions;
    var TVAddTable = permissions.find(
        (option) => option.name === "查看电视广告视频",
    );
    TVAddStoreProxy.TVAddtableUrl = `${TVAddTable?.url}/${TVAddTable?.id}`;
    return true;
};
