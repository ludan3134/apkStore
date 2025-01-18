import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {AddStore} from "./model";
import {Advertisement} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";

export const AddStoreProxy = proxy<AddStore>({
    AddEdit: {} as Advertisement,
    Addlist: [],
    AddFilter: {} as Advertisement,
    AddtableUrl: "",
});

export const useproxy_AddEdit = () => {
    var AddlistStore = useProxy(AddStoreProxy);
    console.info("调用useAddlistRows,返回Rows列表:", AddlistStore.AddEdit);
    return AddlistStore.AddEdit;
};
export const useproxy_AddFilter = () => {
    var AddlistStore = useProxy(AddStoreProxy);
    console.info("调用useAddlistRows,返回Rows列表:", AddlistStore.AddFilter);
    return AddlistStore.AddFilter;
};
export const useproxy_AddtableUrl = () => {
    var AddlistStore = useProxy(AddStoreProxy);
    console.info("调用useAddlistRows,返回Rows列表:", AddlistStore.AddtableUrl);
    return AddlistStore.AddtableUrl;
};
export const initialAddParams: Advertisement = {
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
export const initialAddfilterParams: Advertisement = {
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
export const pre_AddlistLoader = async () => {
    var permissions = authProxy.permissions;
    var AddTable = permissions.find((option) => option.name === "查看广告视频");
    AddStoreProxy.AddtableUrl = `${AddTable?.url}/${AddTable?.id}`;
    return true;
};
