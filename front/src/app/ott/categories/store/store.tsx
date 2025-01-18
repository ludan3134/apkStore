import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ApkCategoryStore} from "./model";
import {ApkCategory} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";

export const ApkCategoryStoreProxy = proxy<ApkCategoryStore>({
    ApkCategoryEdit: {} as ApkCategory,
    ApkCategoryList: [] as ApkCategory[],
    ApkCategoryUrl: "",
    ApkCategoryFilter: {} as ApkCategory,
});

export const useproxy_ApkCategoryEdit = () => {
    var ApkCategorylistStore = useProxy(ApkCategoryStoreProxy);
    console.info(
        "调用useApkCategorylistRows,返回Rows列表:",
        ApkCategorylistStore.ApkCategoryEdit,
    );
    return ApkCategorylistStore.ApkCategoryEdit;
};

export const useproxy_ApkCategorytableUrl = () => {
    var ApkCategorylistStore = useProxy(ApkCategoryStoreProxy);
    console.info(
        "调用useApkCategorylistRows,返回Rows列表:",
        ApkCategorylistStore.ApkCategoryUrl,
    );
    return ApkCategorylistStore.ApkCategoryUrl;
};
export const useproxy_ApkCategorysFilter = () => {
    var ApkCategoryslistStore = useProxy(ApkCategoryStoreProxy);
    console.info(
        "调用useApkCategoryslistRows,返回Rows列表:",
        ApkCategoryslistStore.ApkCategoryFilter,
    );
    return ApkCategoryslistStore.ApkCategoryFilter;
};

export const pre_ApkCategorylistLoader = async () => {
    ApkCategoryStoreProxy.ApkCategoryFilter = {}
    var permissions = authProxy.permissions;
    var url = permissions.find(
        (option) => option.name === "查看Apk类型",
    );
    ApkCategoryStoreProxy.ApkCategoryUrl = `${url?.url}/${url?.id}`;
    return true;
};

export const initialApkCategoryfilterParams: ApkCategory = {
    distributorId: "",
    modelId: "",
};
