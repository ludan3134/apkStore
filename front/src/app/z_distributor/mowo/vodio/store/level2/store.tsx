import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VideoStore} from "./model";
import {Video} from "../../../../../../api/ta/v1/tam_pb";
import {authProxy} from "../../../../../auth/store/store";

export const VideoStoreproxy = proxy<VideoStore>({
    VideoEdit: {} as Video,
    Videolist: [],
    VideoFilter: {} as Video,
    VideotableUrl: [] as string[],
});

export const useproxy_VideoEdit = () => {
    var VideoStore = useProxy(VideoStoreproxy);
    console.info("调用useVideoRows,返回Rows列表:", VideoStore.VideoEdit);
    return VideoStore.VideoEdit;
};
export const useproxy_VideoFilter = () => {
    var VideoStore = useProxy(VideoStoreproxy);
    console.info("调用useVideoRows,返回Rows列表:", VideoStore.VideoFilter);
    return VideoStore.VideoFilter;
};
export const useproxy_VideoUrl = () => {
    var VideoStore = useProxy(VideoStoreproxy);
    console.info("调用useVideoRows,返回Rows列表:", VideoStore.VideotableUrl);
    return VideoStore.VideotableUrl;
};
export const initialVideoParams: Video = {
    id: 0,
    title: "",
    description: "",
    duration: "",
    viewCount: "",
    img: "",
    source: "",
    videoId: "",
    url: "",
    sort: 0,
    isRecommended: 0,
    regionCode: "",
    hl: "pt,en,es",
    defaultAudioLanguage: "",
    categoryName: "",
};

export const pre_VideoLoaderFordistributor = async () => {
    var permissions = authProxy.permissions;
    var VideoTable1 = permissions.find(
        (option) => option.name === "查看分销商下级点播视频主分类页面",
    );
    VideoStoreproxy.VideotableUrl[0] = `${VideoTable1?.url}/${VideoTable1?.id}`;
    var VideoTable2 = permissions.find(
        (option) => option.name === "查看分销商下级点播视频子分类页面",
    );
    VideoStoreproxy.VideotableUrl[1] = `${VideoTable2?.url}/${VideoTable2?.id}`;
    var VideoTable3 = permissions.find(
        (option) => option.name === "查看分销商下级点播视频页面",
    );
    VideoStoreproxy.VideotableUrl[2] = `${VideoTable3?.url}/${VideoTable3?.id}`;
    var VideoTable4 = permissions.find(
        (option) => option.name === "查看分销商视频点播所属型号",
    );
    VideoStoreproxy.VideotableUrl[3] = `${VideoTable4?.url}/${VideoTable4?.id}`;
    // var res = await grpcAllOption(authProxy.token);
    // RecommendStoreproxy.AllOption = res.classList;
    // var resclassify = await grpcAllClassify(0,authProxy.token);
    // RecommendStoreproxy.AllCategory = resclassify.categoryList;
    return true;
};
