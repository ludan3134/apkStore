import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {RecommendStore} from "./model";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";
import {grpcAllDistributor} from "../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../distributor/store/store";
import {RecommendApk} from "../../../../api/fs/v1/fm_pb";

export const RecommendStoreproxy = proxy<RecommendStore>({
    RecommendEdit: {} as RecommendApk,
    Recommendlist: [],
    RecommendFilter: {} as RecommendApk,
    RecommendtableUrl: "",
    AllOption: [],
    AllCategory: [],
});

export const useproxy_RecommendEdit = () => {
    var RecommendApkStore = useProxy(RecommendStoreproxy);
    console.info(
        "调用useRecommendApkRows,返回Rows列表:",
        RecommendApkStore.RecommendEdit,
    );
    return RecommendApkStore.RecommendEdit;
};
export const useproxy_RecommendFilter = () => {
    var RecommendApkStore = useProxy(RecommendStoreproxy);
    console.info(
        "调用useRecommendApkRows,返回Rows列表:",
        RecommendApkStore.RecommendFilter,
    );
    return RecommendApkStore.RecommendFilter;
};
export const useproxy_RecommendUrl = () => {
    var RecommendApkStore = useProxy(RecommendStoreproxy);
    console.info(
        "调用useRecommendApkRows,返回Rows列表:",
        RecommendApkStore.RecommendtableUrl,
    );
    return RecommendApkStore.RecommendtableUrl;
};
export const useproxy_AllOption = () => {
    var RecommendApkStore = useProxy(RecommendStoreproxy);
    console.info(
        "调用useRecommendApkRows,返回Rows列表:",
        RecommendApkStore.AllOption,
    );
    return RecommendApkStore.AllOption;
};
export const useproxy_AllCategory = () => {
    var RecommendApkStore = useProxy(RecommendStoreproxy);
    console.info(
        "调用useRecommendApkRows,返回Rows列表:",
        RecommendApkStore.AllCategory,
    );
    return RecommendApkStore.AllCategory;
};
export const initialRecommendApkParams: RecommendApk = {};

export const pre_RecommendLoader = async () => {
    var permissions = authProxy.permissions;
    var RecommendApkTable = permissions.find(
        (option) => option.name === "查看APK推荐",
    );
    RecommendStoreproxy.RecommendtableUrl = `${RecommendApkTable?.url}/${RecommendApkTable?.id}`;
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    var res1 = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = res1.tree;
    return true;
};
