import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVTerminalBulkImport, TVTerminalStore} from "./model";
import {TerminalFilter, TerminalInfo} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcTVDistributorLot} from "../../../../const/distributor2lot/tv/grpcDistributor2lot";

export const TVTerminalStoreProxy = proxy<TVTerminalStore>({
    TVTerminalEdit: {} as TerminalInfo,
    TVTerminallist: [],
    TVTerminalFilter: {} as TerminalFilter,
    TVTerminaltableUrl: "",
});

export const useproxy_TVTerminalEdit = () => {
    var TVTerminallistStore = useProxy(TVTerminalStoreProxy);
    console.info(
        "调用useTVTerminallistRows,返回Rows列表:",
        TVTerminallistStore.TVTerminalEdit,
    );
    return TVTerminallistStore.TVTerminalEdit;
};
export const useproxy_TVTerminalFilter = () => {
    var TVTerminallistStore = useProxy(TVTerminalStoreProxy);
    console.info(
        "调用useTVTerminallistRows,返回Rows列表:",
        TVTerminallistStore.TVTerminalFilter,
    );
    return TVTerminallistStore.TVTerminalFilter;
};
export const useproxy_TVTerminaltableUrl = () => {
    var TVTerminallistStore = useProxy(TVTerminalStoreProxy);
    console.info(
        "调用useTVTerminallistRows,返回Rows列表:",
        TVTerminallistStore.TVTerminaltableUrl,
    );
    return TVTerminallistStore.TVTerminaltableUrl;
};
export const initialTVTerminalParams: TerminalInfo = {
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
export const initialTVTerminalBulkImportParams: TVTerminalBulkImport = {
    distributor_id: "",
    lot_id: "",
    set_active: false,
    set_service: false,
};
export const initialTVTerminalfilterParams: TerminalFilter = {
    distributorId: "",
    lotId: "",
    isUsed: "",
    macString: "",
};
export const pre_TVTerminallistLoader = async () => {
    var permissions = authProxy.permissions;
    var TVTerminalTable = permissions.find(
        (option) => option.name === "查看电视终端",
    );
    TVTerminalStoreProxy.TVTerminalFilter = {} as TerminalFilter
    TVTerminalStoreProxy.TVTerminaltableUrl = `${TVTerminalTable?.url}/${TVTerminalTable?.id}`;
    grpcTVDistributorLot();
    return true;
};
