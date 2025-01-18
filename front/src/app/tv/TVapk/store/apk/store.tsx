import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVApkStore} from "./model";
import {Apk, ApkFilter} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";
import {grpcAllDistributor} from "../../../../distributor/api/grpcAllDistributor";
import {grpcAllModel} from "../../../../model/api/grpcAllModel";
import {DistributorTreeStoreProxy} from "../../../../distributor/store/store";
import {ModelStoreProxy} from "../../../../model/store/store";

export const TVApkStoreProxy = proxy<TVApkStore>({
    TVApkEdit: {} as Apk,
    TVApklist: [],
    TVApkFilter: {} as ApkFilter,
    TVApktableUrl: "",
    TVApkCopy: [],
});

export const useproxy_TVApkEdit = () => {
    var TVApklistStore = useProxy(TVApkStoreProxy);
    console.info("调用useTVApklistRows,返回Rows列表:", TVApklistStore.TVApkEdit);
    return TVApklistStore.TVApkEdit;
};
export const useproxy_TVApkFilter = () => {
    var TVApklistStore = useProxy(TVApkStoreProxy);
    console.info(
        "调用useTVApklistRows,返回Rows列表:",
        TVApklistStore.TVApkFilter,
    );
    return TVApklistStore.TVApkFilter;
};
export const useproxy_TVApktableUrl = () => {
    var TVApklistStore = useProxy(TVApkStoreProxy);
    console.info(
        "调用useTVApklistRows,返回Rows列表:",
        TVApklistStore.TVApktableUrl,
    );
    return TVApklistStore.TVApktableUrl;
};
export const useproxy_TVApkCopy = () => {
    var TVApklistStore = useProxy(TVApkStoreProxy);
    console.info("调用useTVApklistRows,返回Rows列表:", TVApklistStore.TVApkCopy);
    return TVApklistStore.TVApkCopy;
};
export const initialTVApkParams: Apk = {
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

export const initialTVApkfilterParams: ApkFilter = {
    class: "",
    isShowBanner: "",
    isShowOnMarket: "",
    isWhite: "",
    name: "",
    type: "",
};
export const pre_TVApklistLoader = async () => {
    var permissions = authProxy.permissions;
    var TVApkTable = permissions.find((option) => option.name === "查看电视APK");
    TVApkStoreProxy.TVApktableUrl = `${TVApkTable?.url}/${TVApkTable?.id}`;
    // grpcDistributorToModel()
    var distributores = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = distributores.tree;
    var modelres = await grpcAllModel();
    ModelStoreProxy.AllModel = modelres.tree;
    return true;
};
export const TVApkStarOptions = [
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
