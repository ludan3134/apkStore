import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {MacAccount} from "../../../../api/ks/v1/km_pb";
import {AccountBulkImport, XCACCountStore} from "./model";
import {authProxy} from "../../../auth/store/store";
import {grpcXstreamCombo} from "../../live/xc_combination/api/grpcXstreamCombo";
import {XCombotoreProxy} from "../../live/xc_combination/store/store";

export const XCAccountStoreproxy = proxy<XCACCountStore>({
    XCACCountEdit: {} as MacAccount,
    XCACCountlist: [],
    XCACCountFilter: {} as MacAccount,
    XCACCounttableUrl: "",
});

export const useproxy_XCaccountEdit = () => {
    var XCombolistStore = useProxy(XCAccountStoreproxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.XCACCountEdit,
    );
    return XCombolistStore.XCACCountEdit;
};
export const useproxy_XCaccountFilter = () => {
    var XCombolistStore = useProxy(XCAccountStoreproxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.XCACCountFilter,
    );
    return XCombolistStore.XCACCountFilter;
};
export const useproxy_XCaccountUrl = () => {
    var XCombolistStore = useProxy(XCAccountStoreproxy);
    console.info(
        "调用useXCombolistRows,返回Rows列表:",
        XCombolistStore.XCACCounttableUrl,
    );
    return XCombolistStore.XCACCounttableUrl;
};
export const initialXComboParams: MacAccount = {};
export const initialTvmAccountBulkImportParams: AccountBulkImport = {
    duration: "0day",
    combo_id: "0",
    platform_type: "1",
};
export const pre_XCAccountLoader = async () => {
    var permissions = authProxy.permissions;
    var XComboTable = permissions.find(
        (option) => option.name === "查看XC用户",
    );
    XCAccountStoreproxy.XCACCounttableUrl = `${XComboTable?.url}/${XComboTable?.id}`;
    var res = await grpcXstreamCombo();
    XCombotoreProxy.allXCombo = res.xstreamComboList;
    return true;
};
