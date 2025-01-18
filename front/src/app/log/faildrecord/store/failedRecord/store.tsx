import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {FailedRecordBulkImport, FailedRecordStore} from "./model";
import {FailedRecord} from "../../../../../api/ax/v1/axm_pb";
import {authProxy} from "../../../../auth/store/store";
import {grpcDistributorLot} from "../../../../../const/distributor2lot/grpcDistributor2lot";

export const FailedRecordStoreProxy = proxy<FailedRecordStore>({
    FailedRecordEdit: {} as FailedRecord,
    FailedRecordlist: [],
    FailedRecordFilter: {} as FailedRecord,
    FailedRecordtableUrl: "",
});

export const useproxy_FailedRecordEdit = () => {
    var FailedRecordlistStore = useProxy(FailedRecordStoreProxy);
    console.info(
        "调用useFailedRecordlistRows,返回Rows列表:",
        FailedRecordlistStore.FailedRecordEdit,
    );
    return FailedRecordlistStore.FailedRecordEdit;
};
export const useproxy_FailedRecordFilter = () => {
    var FailedRecordlistStore = useProxy(FailedRecordStoreProxy);
    console.info(
        "调用useFailedRecordlistRows,返回Rows列表:",
        FailedRecordlistStore.FailedRecordFilter,
    );
    return FailedRecordlistStore.FailedRecordFilter;
};
export const useproxy_FailedRecordtableUrl = () => {
    var FailedRecordlistStore = useProxy(FailedRecordStoreProxy);
    console.info(
        "调用useFailedRecordlistRows,返回Rows列表:",
        FailedRecordlistStore.FailedRecordtableUrl,
    );
    return FailedRecordlistStore.FailedRecordtableUrl;
};
export const initialFailedRecordParams: FailedRecord = {
    id: 0,
    identify: "",
    params: "",
    mac: "",
    chip: "",
    sn: "",
    activeCode: "",
    createTime: "",
    total: 0,
    apiType: 0,
    ext: "",
    platformType: 0,
};
export const initialFailedRecordBulkImportParams: FailedRecordBulkImport = {
    distributor_id: "",
    lot_id: "",
    set_active: false,
    set_service: false,
};
export const initialFailedRecordfilterParams: FailedRecord = {
    distributorId: "",
    lotId: "",
    isUsed: "",
    macString: "",
};
export const pre_FailedRecordlistLoader = async () => {
    var permissions = authProxy.permissions;
    var FailedRecordTable = permissions.find(
        (option) => option.name === "查看终端",
    );
    FailedRecordStoreProxy.FailedRecordtableUrl = `${FailedRecordTable?.url}/${FailedRecordTable?.id}`;
    grpcDistributorLot();
    return true;
};
