import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {RecommendStore} from "./model";
import {RecommendApk} from "../../../../../../api/ta/v1/tam_pb";
import {authProxy} from "../../../../../auth/store/store";
import {DistributorInputStoreProxy} from "../../../../../../const/distributortomodel/store/store";

export const RecommendStoreproxy = proxy<RecommendStore>({
    RecommendEdit: {} as RecommendApk,
    Recommendlist: [],
    RecommendFilter: {} as RecommendApk,
    RecommendtableUrl: [] as string[],
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
    sort: 0,
    lang: "",
    className: "",
};

export const pre_RecommendForDistributorLoader = async () => {
    var permissions = authProxy.permissions;
    var RecommendApkTable1 = permissions.find(
        (option) => option.name === "查看分销商下级推荐APK页面",
    );
    RecommendStoreproxy.RecommendtableUrl[0] = `${RecommendApkTable1?.url}/${RecommendApkTable1?.id}`;

    var RecommendApkTable2 = permissions.find(
        (option) => option.name === "查看分销商下级推荐APK主分类页面",
    );
    RecommendStoreproxy.RecommendtableUrl[1] = `${RecommendApkTable2?.url}/${RecommendApkTable2?.id}`;

    var RecommendApkTable3 = permissions.find(
        (option) => option.name === "查看分销商推荐APK所属型号",
    );
    RecommendStoreproxy.RecommendtableUrl[2] = `${RecommendApkTable3?.url}/${RecommendApkTable3?.id}`;
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    return true;
};
