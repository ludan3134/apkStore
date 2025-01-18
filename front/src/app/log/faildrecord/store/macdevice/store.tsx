import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {MacDeviceBulkImport, MacDeviceStore} from "./model";
import {MacDevice} from "../../../../../api/ax/v1/axm_pb";

export const MacDeviceStoreProxy = proxy<MacDeviceStore>({
    MacDeviceEdit: {} as MacDevice,
    MacDevicelist: [],
    MacDeviceFilter: {} as MacDevice,
    MacDevicetableUrl: "",
});

export const useproxy_MacDeviceEdit = () => {
    var MacDevicelistStore = useProxy(MacDeviceStoreProxy);
    console.info(
        "调用useMacDevicelistRows,返回Rows列表:",
        MacDevicelistStore.MacDeviceEdit,
    );
    return MacDevicelistStore.MacDeviceEdit;
};
export const useproxy_MacDeviceFilter = () => {
    var MacDevicelistStore = useProxy(MacDeviceStoreProxy);
    console.info(
        "调用useMacDevicelistRows,返回Rows列表:",
        MacDevicelistStore.MacDeviceFilter,
    );
    return MacDevicelistStore.MacDeviceFilter;
};
export const useproxy_MacDevicetableUrl = () => {
    var MacDevicelistStore = useProxy(MacDeviceStoreProxy);
    console.info(
        "调用useMacDevicelistRows,返回Rows列表:",
        MacDevicelistStore.MacDevicetableUrl,
    );
    return MacDevicelistStore.MacDevicetableUrl;
};
export const initialMacDeviceParams: MacDevice = {};
export const initialMacDeviceBulkImportParams: MacDeviceBulkImport = {
    distributor_id: "",
    lot_id: "",
    set_active: false,
    set_service: false,
};
export const initialMacDevicefilterParams: MacDevice = {};
export const pre_MacDevicelistLoader = async () => {
    MacDeviceStoreProxy.MacDeviceFilter = {} as MacDevice
    return true;
};
