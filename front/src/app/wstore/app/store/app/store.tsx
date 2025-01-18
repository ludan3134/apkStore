import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {AppsCopyparams, AppsStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {grpcAllDistributor} from "../../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../../distributor/store/store";
import {ModelStoreProxy} from "../../../../model/store/store";
import {grpcAllModel} from "../../../../model/api/grpcAllModel";
import {Apps} from "../../../../../api/ws/v1/wm_pb";
import {grpcAllCategories} from "../../../categories/api/grpcAllCategories";
import {grpcAllPriceplans} from "../../../priceplans/api/grpcAllPriceplans";

export const AppsStoreProxy = proxy<AppsStore>({
    AppsEdit: {} as Apps,
    Appslist: [],
    AppsFilter: {} as Apps,
    AppstableUrl: "",
    AppsCopy: [],
    allCategories: [],
    allPriceplans: [],
});

export const useproxy_AppsEdit = () => {
    var AppslistStore = useProxy(AppsStoreProxy);
    console.info("调用useAppslistRows,返回Rows列表:", AppslistStore.AppsEdit);
    return AppslistStore.AppsEdit;
};
export const useproxy_AppsFilter = () => {
    var AppslistStore = useProxy(AppsStoreProxy);
    console.info("调用useAppslistRows,返回Rows列表:", AppslistStore.AppsFilter);
    return AppslistStore.AppsFilter;
};
export const useproxy_AppstableUrl = () => {
    var AppslistStore = useProxy(AppsStoreProxy);
    console.info("调用useAppslistRows,返回Rows列表:", AppslistStore.AppstableUrl);
    return AppslistStore.AppstableUrl;
};
export const useproxy_AppsCopy = () => {
    var AppslistStore = useProxy(AppsStoreProxy);
    console.info("调用useAppslistRows,返回Rows列表:", AppslistStore.AppsCopy);
    return AppslistStore.AppsCopy;
};
export const useproxy_allCategories = () => {
    var XCombolistStore = useProxy(AppsStoreProxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.allCategories,
    );
    return XCombolistStore.allCategories;
};
export const useproxy_allPriceplans = () => {
    var XCombolistStore = useProxy(AppsStoreProxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.allPriceplans,
    );
    return XCombolistStore.allPriceplans;
};
export const useproxy_AppCopy = () => {
    var XCombolistStore = useProxy(AppsStoreProxy);
    console.info("调用useXCombolistRows,返回Rows列表:", XCombolistStore.AppsCopy);
    return XCombolistStore.AppsCopy;
};
export const initialAppsParams: Apps = {
    id: 0,
    appName: "",
    appDescription: "",
    appIcon: "",
    appCarousel: "",
    appSort: "0",
    appBanner: [],
    systemRequirement: "",
    rating: 0,
    categoriesIds: [],
    categoriesName: [],
    pricePlansIds: [],
    pricePlansName: [],
};

export const initialAppsCopyParams: AppsCopyparams = {
    AppIds: [],
    distributorId: 0,
    modelId: 0,
    categoriesIds: [],
    priceplans: [],
};
export const initialAppsfilterParams: Apps = {
    id: 0,
    appName: "",
    appDescription: "",
    appIcon: "",
    appCarousel: "",
    appSort: "0",
    appBanner: [],
    systemRequirement: "",
    rating: 0,
    categoriesIds: [],
    pricePlansIds: [],
    pricePlansName: [],
};
export const pre_AppslistLoader = async () => {
    var permissions = authProxy.permissions;
    var AppsTable = permissions.find((option) => option.name === "查看Apps");
    AppsStoreProxy.AppstableUrl = `${AppsTable?.url}/${AppsTable?.id}`;
    // grpcDistributorToModel()
    var distributores = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = distributores.tree;
    // AppsStoreProxy.AppsFilter = {} as Apps;
    var modelres = await grpcAllModel();
    var res1 = await grpcAllCategories(authProxy.token);
    AppsStoreProxy.allCategories = res1.categoriesLabelList;
    var res2 = await grpcAllPriceplans(authProxy.token);
    AppsStoreProxy.allPriceplans = res2.priceLabelList;

    ModelStoreProxy.AllModel = modelres.tree;
    return true;
};
export const AppsStarOptions = [
    {
        id: 1,
        label: "1",
    },
    {
        id: 2,
        label: "2",
    },
    {
        id: 3,
        label: "3",
    },
    {
        id: 4,
        label: "4",
    },
    {
        id: 5,
        label: "5",
    },
];
