import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {MacAccount, XstreamCombo} from "../../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../../auth/store/store";
import {XComboStore} from "./model";
import {grpcXstreamsource} from "../../xc_mapping/api/grpcXstreamsource";
import {XStreamStoreProxy} from "../../xc_mapping/store/store";
import {grpcXstreamCombo} from "../api/grpcXstreamCombo";
import {XCAccountStoreproxy} from "../../../account/store/store";

export const XCombotoreProxy = proxy<XComboStore>({
    XComboEdit: {} as XstreamCombo,
    XCombolist: [],
    XComboFilter: {} as XstreamCombo,
    XCombotableUrl: "",
    allXCombo: [],
});

export const useproxy_XComboEdit = () => {
    var XCombolistStore = useProxy(XCombotoreProxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.XComboEdit,
    );
    return XCombolistStore.XComboEdit;
};
export const useproxy_XComboFilter = () => {
    var XCombolistStore = useProxy(XCombotoreProxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.XComboFilter,
    );
    return XCombolistStore.XComboFilter;
};
export const useproxy_allXCombo = () => {
    var XCombolistStore = useProxy(XCombotoreProxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.allXCombo,
    );
    return XCombolistStore.allXCombo;
};
export const useproxy_XCombotableUrl = () => {
    var XCombolistStore = useProxy(XCombotoreProxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.XCombotableUrl,
    );
    return XCombolistStore.XCombotableUrl;
};
export const initialXComboParams: XstreamCombo = {};
export const pre_XCombolistLoader = async () => {
    var permissions = authProxy.permissions;
    var XComboTable = permissions.find(
        (option) => option.name === "查看套餐组合",
    );
    XCombotoreProxy.XCombotableUrl = `${XComboTable?.url}/${XComboTable?.id}`;
    var res = await grpcXstreamsource();
    XCombotoreProxy.XComboFilter = {} as XstreamCombo
    XStreamStoreProxy.allXstream = res.xstreamResourceList;
    XCAccountStoreproxy.XCACCountFilter = {macAccountTable: 'live'} as MacAccount
    var res1 = await grpcXstreamCombo();

    XCombotoreProxy.allXCombo = res1.xstreamComboList;
    return true;
};
