import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {CategoriesStore} from "./model";
import {Categories} from "../../../../api/ws/v1/wm_pb";

export const CategoriesStoreProxy = proxy<CategoriesStore>({
    CategoriesEdit: {} as Categories,
    CategoriesList: [] as Categories[],
    CategoriesUrl: "",
    CategoriesFilter: {} as Categories,
});

export const useproxy_CategoriesEdit = () => {
    var CategorieslistStore = useProxy(CategoriesStoreProxy);
    console.info(
        "调用useCategorieslistRows,返回Rows列表:",
        CategorieslistStore.CategoriesEdit,
    );
    return CategorieslistStore.CategoriesEdit;
};

export const useproxy_CategoriestableUrl = () => {
    var CategorieslistStore = useProxy(CategoriesStoreProxy);
    console.info(
        "调用useCategorieslistRows,返回Rows列表:",
        CategorieslistStore.CategoriesUrl,
    );
    return CategorieslistStore.CategoriesUrl;
};
export const useproxy_CategoriessFilter = () => {
    var CategoriesslistStore = useProxy(CategoriesStoreProxy);
    console.info(
        "调用useCategoriesslistRows,返回Rows列表:",
        CategoriesslistStore.CategoriesFilter,
    );
    return CategoriesslistStore.CategoriesFilter;
};

export const pre_CategorieslistLoader = async () => {
    return true;
};

export const initialCategoriesfilterParams: Categories = {
    distributorId: "",
    modelId: "",
};
