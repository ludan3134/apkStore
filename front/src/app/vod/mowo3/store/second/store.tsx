import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ClassDataStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {ClassData} from "../../../../../api/ks/v1/km_pb";

export const ClassDataStoreProxy = proxy<ClassDataStore>({
    ClassDataEdit: {} as ClassData,
    ClassDatalist: [],
    ClassDataFilter: {} as ClassData,
    ClassDatatableUrl: "",
});

export const useproxy_ClassDataEdit = () => {
    var ClassDatalistStore = useProxy(ClassDataStoreProxy);
    console.info("调用useClassDatalistRows,返回Rows列表:", ClassDatalistStore.ClassDataEdit);
    return ClassDatalistStore.ClassDataEdit;
};
export const useproxy_ClassDataFilter = () => {
    var ClassDatalistStore = useProxy(ClassDataStoreProxy);
    console.info("调用useClassDatalistRows,返回Rows列表:", ClassDatalistStore.ClassDataFilter);
    return ClassDatalistStore.ClassDataFilter;
};
export const useproxy_ClassDatatableUrl = () => {
    var ClassDatalistStore = useProxy(ClassDataStoreProxy);
    console.info("调用useClassDatalistRows,返回Rows列表:", ClassDatalistStore.ClassDatatableUrl);
    return ClassDatalistStore.ClassDatatableUrl;
};


export const initialClassDataParams: ClassData = {};
export const pre_ClassDatalistLoader = async () => {
    var permissions = authProxy.permissions;
    var ClassDataTable = permissions.find((option) => option.name === "查看mowo二级分类");
    ClassDataStoreProxy.ClassDatatableUrl = `${ClassDataTable?.url}/${ClassDataTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
