import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {SubClassStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {SubClass} from "../../../../../api/ks/v1/km_pb";

export const SubClassStoreProxy = proxy<SubClassStore>({
    SubClassEdit: {} as SubClass,
    SubClasslist: [],
    SubClassFilter: {} as SubClass,
    SubClasstableUrl: "",
});

export const useproxy_SubClassEdit = () => {
    var SubClasslistStore = useProxy(SubClassStoreProxy);
    console.info(
        "调用useSubClasslistRows,返回Rows列表:",
        SubClasslistStore.SubClassEdit,
    );
    return SubClasslistStore.SubClassEdit;
};
export const useproxy_SubClassFilter = () => {
    var SubClasslistStore = useProxy(SubClassStoreProxy);
    console.info(
        "调用useSubClasslistRows,返回Rows列表:",
        SubClasslistStore.SubClassFilter,
    );
    return SubClasslistStore.SubClassFilter;
};
export const useproxy_SubClasstableUrl = () => {
    var SubClasslistStore = useProxy(SubClassStoreProxy);
    console.info(
        "调用useSubClasslistRows,返回Rows列表:",
        SubClasslistStore.SubClasstableUrl,
    );
    return SubClasslistStore.SubClasstableUrl;
};
export const initialSubClassParams: SubClass = {
    id: 0,
    mainClassId: 0,
    name: "",
    zhName: "",
    sort: 0,
    isUse: false,
    keyword: "",
    created: 0,
};
export const pre_SubClasslistLoader = async () => {
    var permissions = authProxy.permissions;
    var SubClassTable = permissions.find(
        (option) => option.name === "查看二级分类",
    );
    SubClassStoreProxy.SubClasstableUrl = `${SubClassTable?.url}/${SubClassTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
