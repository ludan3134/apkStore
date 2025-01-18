import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {CommonMeta} from "../../../../api/com/v1/pagemeta_pb";
import {EventStore} from "./model";
import {MajorEvent} from "../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../auth/store/store";

export const EventStoreProxy = proxy<EventStore>({
    EventEdit: {} as MajorEvent,
    Eventlist: [],
    EventFilter: {} as CommonMeta,
    EventtableUrl: "",
});
export const useproxy_EventFilter = () => {
    var TerminallistStore = useProxy(EventStoreProxy);
    console.info("调用时间范围格式,返回Rows列表:", TerminallistStore.EventFilter);
    return TerminallistStore.EventFilter;
};

export const useproxy_EventEdit = () => {
    var NotificationlistStore = useProxy(EventStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.EventEdit,
    );
    return NotificationlistStore.EventEdit;
};
export const useproxy_EventUrl = () => {
    var NotificationlistStore = useProxy(EventStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.EventtableUrl,
    );
    return NotificationlistStore.EventtableUrl;
};
export const initialEventParams: MajorEvent = {
    id: 0,
    title: "",
    liveMatch: "",
    baseTime: 0,
    matchData: "",
    sort: 0,
    ext: "",
};
export const eventlistLoader = async () => {
    var permissions = authProxy.permissions;
    var NotificationTable = permissions.find(
        (option) => option.name === "查看赛事预告",
    );
    EventStoreProxy.EventtableUrl = `${NotificationTable?.url}/${NotificationTable?.id}`;
    return true;
};
