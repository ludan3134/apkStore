import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ClassResourceStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {ClassResource} from "../../../../../api/ks/v1/km_pb";

export const ClassResourceStoreProxy = proxy<ClassResourceStore>({
    ClassResourceEdit: {} as ClassResource,
    ClassResourcelist: [],
    ClassResourceFilter: {} as ClassResource,
    ClassResourcetableUrl: "",
});

export const useproxy_ClassResourceEdit = () => {
    var ClassResourcelistStore = useProxy(ClassResourceStoreProxy);
    console.info(
        "调用useClassResourcelistRows,返回Rows列表:",
        ClassResourcelistStore.ClassResourceEdit,
    );
    return ClassResourcelistStore.ClassResourceEdit;
};
export const useproxy_ClassResourceFilter = () => {
    var ClassResourcelistStore = useProxy(ClassResourceStoreProxy);
    console.info(
        "调用useClassResourcelistRows,返回Rows列表:",
        ClassResourcelistStore.ClassResourceFilter,
    );
    return ClassResourcelistStore.ClassResourceFilter;
};
export const useproxy_ClassResourcetableUrl = () => {
    var ClassResourcelistStore = useProxy(ClassResourceStoreProxy);
    console.info(
        "调用useClassResourcelistRows,返回Rows列表:",
        ClassResourcelistStore.ClassResourcetableUrl,
    );
    return ClassResourcelistStore.ClassResourcetableUrl;
};
export const initialClassResourceParams: ClassResource = {};
export const pre_ClassResourcelistLoader = async () => {
    var permissions = authProxy.permissions;
    var ClassResourceTable = permissions.find(
        (option) => option.name === "查看三级分类",
    );
    ClassResourceStoreProxy.ClassResourcetableUrl = `${ClassResourceTable?.url}/${ClassResourceTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
