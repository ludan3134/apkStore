import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {EpgStore} from "./model";
import {authProxy} from "../../../auth/store/store";
import {Epg} from "../../../../api/ks/v1/km_pb";

export const EpgStoreProxy = proxy<EpgStore>({
    EpgEdit: {} as Epg,
    Epglist: [],
    EpgFilter: {} as Epg,
    EpgtableUrl: "",
});
export const useproxy_EpgFilter = () => {
    var TerminallistStore = useProxy(EpgStoreProxy);
    console.info("调用时间范围格式,返回Rows列表:", TerminallistStore.EpgFilter);
    return TerminallistStore.EpgFilter;
};

export const useproxy_EpgEdit = () => {
    var NotificationlistStore = useProxy(EpgStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.EpgEdit,
    );
    return NotificationlistStore.EpgEdit;
};
export const useproxy_EpgUrl = () => {
    var NotificationlistStore = useProxy(EpgStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.EpgtableUrl,
    );
    return NotificationlistStore.EpgtableUrl;
};
export const initialEpgParams: Epg = {
    id: 0n,
    paradeTimestamp: 0,
    paradeName: "",
    channelName: "",
    endTimestamp: 0,
    channelList: [],
};
export const EpglistLoader = async () => {
    var permissions = authProxy.permissions;
    var NotificationTable = permissions.find(
        (option) => option.name === "查看预告",
    );
    EpgStoreProxy.EpgtableUrl = `${NotificationTable?.url}/${NotificationTable?.id}`;
    return true;
};
