import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {RecommendStore} from "./model";
import {RecommendApk} from "../../../../api/ta/v1/tam_pb";
import {grpcAllOption} from "../../option/api/grpcAllOption";
import {grpcAllClassify} from "../../classify/api/grpcAllClassify";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";
import {grpcAllDistributor} from "../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../distributor/store/store";

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
export const initialRecommendApkParams: RecommendApk = {
    id: 0,
    img: "",
    packageName: "",
    appName: "",
    sort: 0,
    classId: 0,
    lang: "",
    className: "",
};

export const pre_RecommendLoader = async () => {
    var permissions = authProxy.permissions;
    var RecommendApkTable = permissions.find(
        (option) => option.name === "查看APK推荐",
    );
    RecommendStoreproxy.RecommendtableUrl = `${RecommendApkTable?.url}/${RecommendApkTable?.id}`;
    var res = await grpcAllOption(authProxy.token);
    RecommendStoreproxy.AllOption = res.classList;
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    var resclassify = await grpcAllClassify(0, authProxy.token);
    RecommendStoreproxy.AllCategory = resclassify.categoryList;
    var res1 = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = res1.tree;
    return true;
};
