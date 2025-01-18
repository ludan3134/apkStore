import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {NotificationStore} from "./model";
import {authProxy} from "../../../auth/store/store";
import {Notification} from "../../../../api/tv_fs/v1/fm_pb";

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
export const initialNotificationParams: Notification = {
    id: "",
    name: "",
    content: "",
    distributorId: "",
    modelId: "",
    isUse: false,
    modelName: "",
    distributorName: "",
};
export const pre_NotificationlistLoader = async () => {
    var permissions = authProxy.permissions;
    var NotificationTable = permissions.find(
        (option) => option.name === "分销商查看电视消息通知",
    );
    NotificationStoreProxy.NotificationtableUrl = `${NotificationTable?.url}/${NotificationTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
