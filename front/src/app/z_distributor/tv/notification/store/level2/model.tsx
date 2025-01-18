import {Notification} from "../../../../../../api/tv_fs/v1/fm_pb";

export type NotificationStore = {
    NotificationEdit: Notification;
    Notificationlist: [];
    NotificationFilter: Notification;
    NotificationtableUrl: string;
};
