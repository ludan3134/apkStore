import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VodStore} from "./model";
import {Vod} from "../../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../../auth/store/store";
import {DistributorInputStoreProxy} from "../../../../../const/distributortomodel/store/store";


export const VodStoreproxy = proxy<VodStore>({
    VodEdit: {} as Vod,
    Vodlist: [],
    VodFilter: {} as Vod,
    VodtableUrl: [] as string[],
    AllOption: [],
    AllCategory: [],
});

export const useproxy_VodEdit = () => {
    var VodStore = useProxy(VodStoreproxy);
    console.info(
        "调用useVodRows,返回Rows列表:",
        VodStore.VodEdit,
    );
    return VodStore.VodEdit;
};
export const useproxy_VodFilter = () => {
    var VodStore = useProxy(VodStoreproxy);
    console.info(
        "调用useVodRows,返回Rows列表:",
        VodStore.VodFilter,
    );
    return VodStore.VodFilter;
};
export const useproxy_VodUrl = () => {
    var VodStore = useProxy(VodStoreproxy);
    console.info(
        "调用useVodRows,返回Rows列表:",
        VodStore.VodtableUrl,
    );
    return VodStore.VodtableUrl;
};
export const useproxy_VodAllOption = () => {
    var VodStore = useProxy(VodStoreproxy);
    console.info(
        "调用useVodRows,返回Rows列表:",
        VodStore.AllOption,
    );
    return VodStore.AllOption;
};
export const useproxy_VodAllCategory = () => {
    var VodStore = useProxy(VodStoreproxy);
    console.info(
        "调用useVodRows,返回Rows列表:",
        VodStore.AllCategory,
    );
    return VodStore.AllCategory;
};
export const initialVodParams: Vod = {};

export const pre_VodForDistributorLoader = async () => {
    var permissions = authProxy.permissions;
    var VodTable1 = permissions.find(
        (option) => option.name === "查看分销商下级推荐APK页面",
    );
    VodStoreproxy.VodtableUrl[0] = `${VodTable1?.url}/${VodTable1?.id}`;

    var VodTable2 = permissions.find(
        (option) => option.name === "查看分销商下级推荐APK主分类页面",
    );
    VodStoreproxy.VodtableUrl[1] = `${VodTable2?.url}/${VodTable2?.id}`;

    var VodTable3 = permissions.find(
        (option) => option.name === "查看分销商推荐APK所属型号",
    );
    VodStoreproxy.VodtableUrl[2] = `${VodTable3?.url}/${VodTable3?.id}`;
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    return true;
};
