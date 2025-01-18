import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ApkStore} from "./model";
import {Apk, ApkFilter} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";
import {grpcAllDistributor} from "../../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../../distributor/store/store";
import {ModelStoreProxy} from "../../../../model/store/store";
import {grpcAllModel} from "../../../../model/api/grpcAllModel";

export const ApkStoreProxy = proxy<ApkStore>({
    ApkEdit: {} as Apk,
    Apklist: [],
    ApkFilter: {} as ApkFilter,
    ApktableUrl: "",
    ApkCopy: [],
});

export const useproxy_ApkEdit = () => {
    var ApklistStore = useProxy(ApkStoreProxy);
    console.info("调用useApklistRows,返回Rows列表:", ApklistStore.ApkEdit);
    return ApklistStore.ApkEdit;
};
export const useproxy_ApkFilter = () => {
    var ApklistStore = useProxy(ApkStoreProxy);
    console.info("调用useApklistRows,返回Rows列表:", ApklistStore.ApkFilter);
    return ApklistStore.ApkFilter;
};
export const useproxy_ApktableUrl = () => {
    var ApklistStore = useProxy(ApkStoreProxy);
    console.info("调用useApklistRows,返回Rows列表:", ApklistStore.ApktableUrl);
    return ApklistStore.ApktableUrl;
};
export const useproxy_ApkCopy = () => {
    var ApklistStore = useProxy(ApkStoreProxy);
    console.info("调用useApklistRows,返回Rows列表:", ApklistStore.ApkCopy);
    return ApklistStore.ApkCopy;
};
export const initialApkParams: Apk = {
    id: "",
    name: "",
    type: "",
    class: "",
    img: "",
    sort: 0,
    isShowOnMarket: false,
    modelId: "",
    star: 0,
    downloadCount: 0,
    bannerImg: "",
    isShowBanner: false,
    distributorId: "",
};

export const initialApkfilterParams: ApkFilter = {
    class: "",
    isShowBanner: "",
    isShowOnMarket: "",
    isWhite: "",
    name: "",
    type: "",
};
export const pre_ApklistLoader = async () => {
    var permissions = authProxy.permissions;
    var ApkTable = permissions.find((option) => option.name === "查看APK");
    ApkStoreProxy.ApktableUrl = `${ApkTable?.url}/${ApkTable?.id}`;
    // grpcDistributorToModel()
    var distributores = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = distributores.tree;
    var modelres = await grpcAllModel();
    ModelStoreProxy.AllModel = modelres.tree;
    return true;
};
export const apkStarOptions = [
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
