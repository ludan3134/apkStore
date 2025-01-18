import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {MowoClassStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {MowoClass} from "../../../../../api/ks/v1/km_pb";
import {grpcXstreamCombo} from "../../../../tvm/live/xc_combination/api/grpcXstreamCombo";
import {XCombotoreProxy} from "../../../../tvm/live/xc_combination/store/store";

export const MowoClassStoreProxy = proxy<MowoClassStore>({
    MowoClassEdit: {} as MowoClass,
    MowoClasslist: [],
    MowoClassFilter: {} as MowoClass,
    MowoClasstableUrl: "",
});

export const useproxy_MowoClassEdit = () => {
    var MowoClasslistStore = useProxy(MowoClassStoreProxy);
    console.info(
        "调用useMowoClasslistRows,返回Rows列表:",
        MowoClasslistStore.MowoClassEdit,
    );
    return MowoClasslistStore.MowoClassEdit;
};
export const useproxy_MowoClassFilter = () => {
    var MowoClasslistStore = useProxy(MowoClassStoreProxy);
    console.info(
        "调用useMowoClasslistRows,返回Rows列表:",
        MowoClasslistStore.MowoClassFilter,
    );
    return MowoClasslistStore.MowoClassFilter;
};
export const useproxy_MowoClasstableUrl = () => {
    var MowoClasslistStore = useProxy(MowoClassStoreProxy);
    console.info(
        "调用useMowoClasslistRows,返回Rows列表:",
        MowoClasslistStore.MowoClasstableUrl,
    );
    return MowoClasslistStore.MowoClasstableUrl;
};

export const initialMowoClassParams: MowoClass = {};
export const pre_MowoClasslistLoader = async () => {
    var permissions = authProxy.permissions;
    var MowoClassTable = permissions.find(
        (option) => option.name === "查看mowo一级分类",
    );

    MowoClassStoreProxy.MowoClasstableUrl = `${MowoClassTable?.url}/${MowoClassTable?.id}`;
    var res = await grpcXstreamCombo();
    XCombotoreProxy.allXCombo = res.xstreamComboList;
    return true;
};
