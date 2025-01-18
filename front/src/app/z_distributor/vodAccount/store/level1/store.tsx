import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {Top10ManagerStore} from "./model";
import {Top10Manager, VodClassLabel} from "../../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../../auth/store/store";
import {DistributorInputStoreProxy} from "../../../../../const/distributortomodel/store/store";
import {grpcXstreamCombo} from "../../../../tvm/live/xc_combination/api/grpcXstreamCombo";

export const Top10ManagerStoreproxy = proxy<Top10ManagerStore>({
    Top10ManagerEdit: {} as Top10Manager,
    Top10Managerlist: [],
    Top10ManagerFilter: {} as Top10Manager,
    Top10ManagertableUrl: [] as string[],
    Top10ManagerAllClass: [] as VodClassLabel[]
});

export const useproxy_Top10ManagerEdit = () => {
    var Top10ManagerStore = useProxy(Top10ManagerStoreproxy);
    console.info(
        "调用useTop10ManagerRows,返回Rows列表:",
        Top10ManagerStore.Top10ManagerEdit,
    );
    return Top10ManagerStore.Top10ManagerEdit;
};
export const useproxy_Top10ManagerFilter = () => {
    var Top10ManagerStore = useProxy(Top10ManagerStoreproxy);
    console.info(
        "调用useTop10ManagerRows,返回Rows列表:",
        Top10ManagerStore.Top10ManagerFilter,
    );
    return Top10ManagerStore.Top10ManagerFilter;
};
export const useproxy_Top10ManagerUrl = () => {
    var Top10ManagerStore = useProxy(Top10ManagerStoreproxy);
    console.info(
        "调用useTop10ManagerRows,返回Rows列表:",
        Top10ManagerStore.Top10ManagertableUrl,
    );
    return Top10ManagerStore.Top10ManagertableUrl;
};
export const useproxy_Top10ManagerAllClass = () => {
    var Top10ManagerStore = useProxy(Top10ManagerStoreproxy);
    console.info(
        "调用useTop10ManagerRows,返回Rows列表:",
        Top10ManagerStore.Top10ManagerAllClass,
    );
    return Top10ManagerStore.Top10ManagerAllClass;
};

export const initialTop10ManagerParams: Top10Manager = {};

export const pre_Top10ManagerForDistributorLoader = async () => {
    var permissions = authProxy.permissions;
    var Top10ManagerTable1 = permissions.find(
        (option) => option.name === "查看桌面推荐(Top10)",
    );
    Top10ManagerStoreproxy.Top10ManagertableUrl[0] = `${Top10ManagerTable1?.url}/${Top10ManagerTable1?.id}`;

    var Top10ManagerTable2 = permissions.find(
        (option) => option.name === "查看点播视频跳转分类页面",
    );
    Top10ManagerStoreproxy.Top10ManagertableUrl[1] = `${Top10ManagerTable2?.url}/${Top10ManagerTable2?.id}`;

    var Top10ManagerTable3 = permissions.find(
        (option) => option.name === "查看点播视频桌面推荐列表",
    );
    Top10ManagerStoreproxy.Top10ManagertableUrl[2] = `${Top10ManagerTable3?.url}/${Top10ManagerTable3?.id}`;

    var Top10ManagerTable4 = permissions.find(
        (option) => option.name === "查看点播视频桌面推荐链接列表",
    );
    Top10ManagerStoreproxy.Top10ManagertableUrl[3] = `${Top10ManagerTable4?.url}/${Top10ManagerTable4?.id}`;
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    var res = await grpcXstreamCombo();
    Top10ManagerStoreproxy.Top10ManagerAllClass = res.xstreamComboList;
    return true;
};
