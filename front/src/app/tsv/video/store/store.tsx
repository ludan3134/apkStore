import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {VideoStore} from "./model";
import {Video} from "../../../../api/ta/v1/tam_pb";
import {grpcAllOption} from "../../option/api/grpcAllOption";
import {RecommendStoreproxy} from "../../recommend/store/store";
import {grpcAllClassify} from "../../classify/api/grpcAllClassify";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";
import {grpcAllDistributor} from "../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../distributor/store/store";

export const VideoStoreproxy = proxy<VideoStore>({
    VideoEdit: {} as Video,
    Videolist: [],
    VideoFilter: {} as Video,
    VideotableUrl: "",
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
    hl: "",
    defaultAudioLanguage: "",
    categoryName: "",
};

export const pre_VideoLoader = async () => {
    var permissions = authProxy.permissions;
    var VideoTable = permissions.find((option) => option.name === "查看点播视频");
    VideoStoreproxy.VideotableUrl = `${VideoTable?.url}/${VideoTable?.id}`;
    var res = await grpcAllOption(authProxy.token);
    RecommendStoreproxy.AllOption = res.classList;
    var resclassify = await grpcAllClassify(0, authProxy.token);
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    VideoStoreproxy.VideoFilter = {} as Video;
    RecommendStoreproxy.AllCategory = resclassify.categoryList;
    var res1 = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = res1.tree;
    return true;
};
