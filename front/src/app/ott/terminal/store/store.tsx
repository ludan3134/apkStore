import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TerminalBulkImport, TerminalStore} from "./model";
import {TerminalFilter, TerminalInfo} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcDistributorLot} from "../../../../const/distributor2lot/grpcDistributor2lot";

export const TerminalStoreProxy = proxy<TerminalStore>({
    TerminalEdit: {} as TerminalInfo,
    Terminallist: [],
    TerminalFilter: {} as TerminalFilter,
    TerminaltableUrl: "",
});

export const useproxy_TerminalEdit = () => {
    var TerminallistStore = useProxy(TerminalStoreProxy);
    console.info(
        "调用useTerminallistRows,返回Rows列表:",
        TerminallistStore.TerminalEdit,
    );
    return TerminallistStore.TerminalEdit;
};
export const useproxy_TerminalFilter = () => {
    var TerminallistStore = useProxy(TerminalStoreProxy);
    console.info(
        "调用useTerminallistRows,返回Rows列表:",
        TerminallistStore.TerminalFilter,
    );
    return TerminallistStore.TerminalFilter;
};
export const useproxy_TerminaltableUrl = () => {
    var TerminallistStore = useProxy(TerminalStoreProxy);
    console.info(
        "调用useTerminallistRows,返回Rows列表:",
        TerminallistStore.TerminaltableUrl,
    );
    return TerminallistStore.TerminaltableUrl;
};
export const initialTerminalParams: TerminalInfo = {
    id: "",
    distributorId: "",
    lotId: "",
    boxId: "",
    accountId: "",
    isUsed: false,
    macString: "",
    chipIdentity: "",
    serial: "",
    activeCode: "",
};
export const initialTerminalBulkImportParams: TerminalBulkImport = {
    distributor_id: "",
    lot_id: "",
    set_active: false,
    set_service: false,
};
export const initialTerminalfilterParams: TerminalFilter = {
    distributorId: "",
    lotId: "",
    isUsed: "",
    macString: "",
};
export const pre_TerminallistLoader = async () => {
    var permissions = authProxy.permissions;
    var TerminalTable = permissions.find((option) => option.name === "查看终端");
    TerminalStoreProxy.TerminaltableUrl = `${TerminalTable?.url}/${TerminalTable?.id}`;
    TerminalStoreProxy.TerminalFilter = {} as TerminalFilter
    grpcDistributorLot();
    return true;
};
