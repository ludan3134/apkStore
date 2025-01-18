import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {AddressConfig} from "../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcXstreamCombo} from "../../live/xc_combination/api/grpcXstreamCombo";
import {AddressStore} from "./model";

export const AddressStoreproxy = proxy<AddressStore>({
    AddressEdit: {} as AddressConfig,
    Addresslist: [],
    AddressFilter: {} as AddressConfig,
    AddresstableUrl: "",
});

export const useproxy_AddressEdit = () => {
    var AddressConfigStore = useProxy(AddressStoreproxy);
    console.info(
        "调用useAddressConfigRows,返回Rows列表:",
        AddressConfigStore.AddressEdit,
    );
    return AddressConfigStore.AddressEdit;
};
export const useproxy_AddressFilter = () => {
    var AddressConfigStore = useProxy(AddressStoreproxy);
    console.info(
        "调用useAddressConfigRows,返回Rows列表:",
        AddressConfigStore.AddressFilter,
    );
    return AddressConfigStore.AddressFilter;
};
export const useproxy_AddressUrl = () => {
    var AddressConfigStore = useProxy(AddressStoreproxy);
    console.info(
        "调用useAddressConfigRows,返回Rows列表:",
        AddressConfigStore.AddresstableUrl,
    );
    return AddressConfigStore.AddresstableUrl;
};
export const initialAddressConfigParams: AddressConfig = {
    id: 0,
    url: "",
    maxConnections: "",
    type: 0,
};

export const pre_AddressLoader = async () => {
    var permissions = authProxy.permissions;
    var AddressConfigTable = permissions.find(
        (option) => option.name === "查找直播地址",
    );
    AddressStoreproxy.AddresstableUrl = `${AddressConfigTable?.url}/${AddressConfigTable?.id}`;
    var res = await grpcXstreamCombo();
    return true;
};
