import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {CategoryStore} from "./model";
import {Category} from "../../../../api/ta/v1/tam_pb";

export const CategoryStoreproxy = proxy<CategoryStore>({
    CategoryEdit: {} as Category,
    Categorylist: [],
    CategoryFilter: {} as Category,
    CategorytableUrl: "",
});

export const useproxy_CategoryEdit = () => {
    var CategoryStore = useProxy(CategoryStoreproxy);
    console.info("调用useCategoryRows,返回Rows列表:", CategoryStore.CategoryEdit);
    return CategoryStore.CategoryEdit;
};
export const useproxy_CategoryFilter = () => {
    var CategoryStore = useProxy(CategoryStoreproxy);
    console.info(
        "调用useCategoryRows,返回Rows列表:",
        CategoryStore.CategoryFilter,
    );
    return CategoryStore.CategoryFilter;
};
export const useproxy_CategoryUrl = () => {
    var CategoryStore = useProxy(CategoryStoreproxy);
    console.info(
        "调用useCategoryRows,返回Rows列表:",
        CategoryStore.CategorytableUrl,
    );
    return CategoryStore.CategorytableUrl;
};
export const initialCategoryParams: Category = {
    id: 0,
    name: "",
    zhName: "",
    sort: 0,
    classId: 0,
    className: "",
};

export const pre_CategoryLoader = async () => {
    var permissions = authProxy.permissions;
    var CategoryTable = permissions.find(
        (option) => option.name === "查找直播地址",
    );
    CategoryStoreproxy.CategorytableUrl = `${CategoryTable?.url}/${CategoryTable?.id}`;
    return true;
};
