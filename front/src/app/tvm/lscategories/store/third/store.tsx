import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ThirdCalssStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {Channel} from "../../../../../api/ks/v1/km_pb";

export const ThirdCalssStoreProxy = proxy<ThirdCalssStore>({
    ThirdCalssEdit: {} as Channel,
    ThirdCalsslist: [],
    ThirdCalssFilter: {} as Channel,
    ThirdCalsstableUrl: "",
});

export const useproxy_ThirdCalssEdit = () => {
    var ThirdCalsslistStore = useProxy(ThirdCalssStoreProxy);
    console.info(
        "调用useThirdCalsslistRows,返回Rows列表:",
        ThirdCalsslistStore.ThirdCalssEdit,
    );
    return ThirdCalsslistStore.ThirdCalssEdit;
};
export const useproxy_ThirdCalssFilter = () => {
    var ThirdCalsslistStore = useProxy(ThirdCalssStoreProxy);
    console.info(
        "调用useThirdCalsslistRows,返回Rows列表:",
        ThirdCalsslistStore.ThirdCalssFilter,
    );
    return ThirdCalsslistStore.ThirdCalssFilter;
};
export const useproxy_ThirdCalsstableUrl = () => {
    var ThirdCalsslistStore = useProxy(ThirdCalssStoreProxy);
    console.info(
        "调用useThirdCalsslistRows,返回Rows列表:",
        ThirdCalsslistStore.ThirdCalsstableUrl,
    );
    return ThirdCalsslistStore.ThirdCalsstableUrl;
};
export const initialThirdCalssParams: Channel = {
    id: 0,
    subClassId: 0,
    name: "",
    zhName: "",
    keyword: "",
    sort: 0,
    isUse: false,
    channelNumber: 0,
    image: "",
    aliasName: "",
    isRecommend: false,
    isAdult: false,
    rebroadcastUseFlag: 0,
    shiftingUseFlag: 0,
};
export const pre_ThirdCalsslistLoader = async () => {
    var permissions = authProxy.permissions;
    var ThirdCalssTable = permissions.find(
        (option) => option.name === "查看三级分类",
    );
    ThirdCalssStoreProxy.ThirdCalsstableUrl = `${ThirdCalssTable?.url}/${ThirdCalssTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
