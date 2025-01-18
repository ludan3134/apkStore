import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {LinkCalssStore} from "./model";
import {authProxy} from "../../../../auth/store/store";
import {Link} from "../../../../../api/ks/v1/km_pb";

export const LinkCalssStoreProxy = proxy<LinkCalssStore>({
    LinkCalssEdit: {} as Link,
    LinkCalsslist: [],
    LinkCalssFilter: {} as Link,
    LinkCalsstableUrl: "",
});

export const useproxy_LinkCalssEdit = () => {
    var LinkCalsslistStore = useProxy(LinkCalssStoreProxy);
    console.info(
        "调用useLinkCalsslistRows,返回Rows列表:",
        LinkCalsslistStore.LinkCalssEdit,
    );
    return LinkCalsslistStore.LinkCalssEdit;
};
export const useproxy_LinkCalssFilter = () => {
    var LinkCalsslistStore = useProxy(LinkCalssStoreProxy);
    console.info(
        "调用useLinkCalsslistRows,返回Rows列表:",
        LinkCalsslistStore.LinkCalssFilter,
    );
    return LinkCalsslistStore.LinkCalssFilter;
};
export const useproxy_LinkCalsstableUrl = () => {
    var LinkCalsslistStore = useProxy(LinkCalssStoreProxy);
    console.info(
        "调用useLinkCalsslistRows,返回Rows列表:",
        LinkCalsslistStore.LinkCalsstableUrl,
    );
    return LinkCalsslistStore.LinkCalsstableUrl;
};
export const initialLinkCalssParams: Link = {
    id: 0,
    channelId: 0,
    link: "",
    source: "",
    sort: 0,
    isUse: false,
    scriptDeal: false,
    method: "",
    decode: 0,
    mainClassId: 0,
    subClassId: 0,
    keyword: "",
};
export const pre_LinkCalsslistLoader = async () => {
    var permissions = authProxy.permissions;
    var LinkCalssTable = permissions.find(
        (option) => option.name === "查看三级分类",
    );
    LinkCalssStoreProxy.LinkCalsstableUrl = `${LinkCalssTable?.url}/${LinkCalssTable?.id}`;
    // grpcDistributorToModel()
    return true;
};
