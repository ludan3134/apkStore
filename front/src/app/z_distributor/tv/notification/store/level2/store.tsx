import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {NotificationStore} from "./model";
import {Notification} from "../../../../../../api/tv_fs/v1/fm_pb";
import {authProxy} from "../../../../../auth/store/store";

export const NotificationStoreProxy = proxy<NotificationStore>({
    NotificationEdit: {} as Notification,
    Notificationlist: [],
    NotificationFilter: {} as Notification,
    NotificationtableUrl: "",
});

export const useproxy_NotificationEdit = () => {
    var NotificationlistStore = useProxy(NotificationStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.NotificationEdit,
    );
    return NotificationlistStore.NotificationEdit;
};
export const useproxy_NotificationFilter = () => {
    var NotificationlistStore = useProxy(NotificationStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.NotificationFilter,
    );
    return NotificationlistStore.NotificationFilter;
};
export const useproxy_NotificationtableUrl = () => {
    var NotificationlistStore = useProxy(NotificationStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.NotificationtableUrl,
    );
    return NotificationlistStore.NotificationtableUrl;
};
export const initialNotificationParams: Notification = {};
export const pre_NotificationlistLoader = async () => {
    var permissions = authProxy.permissions;
    var NotificationTable = permissions.find(
        (option) => option.name === "查看下级页面",
    );
    NotificationStoreProxy.NotificationtableUrl = `${NotificationTable?.url}/${NotificationTable?.id}`;
    return true;
};

export const pre_NotificationLoader = async () => {
    var permissions = authProxy.permissions;
    var AdvertisementPictureTable = permissions.find(
        (option) => option.name === "查看电视消息通知下级页面",
    );
    NotificationStoreProxy.NotificationtableUrl = `${AdvertisementPictureTable?.url}/${AdvertisementPictureTable?.id}`;
    return true;
};
