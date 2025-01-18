import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {MainClassStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {MainClass} from "../../../../../api/ks/v1/km_pb";
import {grpcXstreamCombo} from "../../../live/xc_combination/api/grpcXstreamCombo";
import {XCombotoreProxy} from "../../../live/xc_combination/store/store";

export const MainClassStoreProxy = proxy<MainClassStore>({
    MainClassEdit: {} as MainClass,
    MainClasslist: [],
    MainClassFilter: {} as MainClass,
    MainClasstableUrl: "",
});

export const useproxy_MainClassEdit = () => {
    var MainClasslistStore = useProxy(MainClassStoreProxy);
    console.info(
        "调用useMainClasslistRows,返回Rows列表:",
        MainClasslistStore.MainClassEdit,
    );
    return MainClasslistStore.MainClassEdit;
};
export const useproxy_MainClassFilter = () => {
    var MainClasslistStore = useProxy(MainClassStoreProxy);
    console.info(
        "调用useMainClasslistRows,返回Rows列表:",
        MainClasslistStore.MainClassFilter,
    );
    return MainClasslistStore.MainClassFilter;
};
export const useproxy_MainClasstableUrl = () => {
    var MainClasslistStore = useProxy(MainClassStoreProxy);
    console.info(
        "调用useMainClasslistRows,返回Rows列表:",
        MainClasslistStore.MainClasstableUrl,
    );
    return MainClasslistStore.MainClasstableUrl;
};
export const initialMainClassParams: MainClass = {
    id: 0,
    name: "",
    zhName: "",
    listName: "",
    probation: "",
    oneMonthPrice: "",
    threeMonthPrice: "",
    sixMonthPrice: "",
    nineMonthPrice: "",
    twelveMonthPrice: "",
    description: "",
    sort: 0,
    created: 0,
    updated: 0,
    deleted: false,
    isShow: false,
    isCharge: false,
    price: "",
    identity: "",
};
export const pre_MainClasslistLoader = async () => {
    var permissions = authProxy.permissions;
    var MainClassTable = permissions.find(
        (option) => option.name === "查看一级分类",
    );
    MainClassStoreProxy.MainClasstableUrl = `${MainClassTable?.url}/${MainClassTable?.id}`;
    var res = await grpcXstreamCombo();
    XCombotoreProxy.allXCombo = res.xstreamComboList;
    // grpcDistributorToModel()
    return true;
};
