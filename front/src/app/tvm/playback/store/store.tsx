import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {PlaybackStore} from "./model";
import {authProxy} from "../../../auth/store/store";
import {Playback} from "../../../../api/ks/v1/km_pb";

export const PlaybackStoreProxy = proxy<PlaybackStore>({
    PlaybackEdit: {} as Playback,
    Playbacklist: [],
    PlaybackFilter: {} as Playback,
    PlaybacktableUrl: "",
});
export const useproxy_PlaybackFilter = () => {
    var TerminallistStore = useProxy(PlaybackStoreProxy);
    console.info(
        "调用时间范围格式,返回Rows列表:",
        TerminallistStore.PlaybackFilter,
    );
    return TerminallistStore.PlaybackFilter;
};

export const useproxy_PlaybackEdit = () => {
    var NotificationlistStore = useProxy(PlaybackStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.PlaybackEdit,
    );
    return NotificationlistStore.PlaybackEdit;
};
export const useproxy_PlaybackUrl = () => {
    var NotificationlistStore = useProxy(PlaybackStoreProxy);
    console.info(
        "调用useNotificationlistRows,返回Rows列表:",
        NotificationlistStore.PlaybacktableUrl,
    );
    return NotificationlistStore.PlaybacktableUrl;
};
export const initialPlaybackParams: Playback = {
    id: 0,
    name: "",
    epgChannelId: "",
    streamId: 0,
    channelList: [],
    categoryId: "",
};
export const PlaybacklistLoader = async () => {
    var permissions = authProxy.permissions;
    var NotificationTable = permissions.find(
        (option) => option.name === "查看回放",
    );
    PlaybackStoreProxy.PlaybacktableUrl = `${NotificationTable?.url}/${NotificationTable?.id}`;
    return true;
};
