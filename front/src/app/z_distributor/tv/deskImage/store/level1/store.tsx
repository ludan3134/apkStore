import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ProvideTemplateStore} from "./model";
import {ProvideTemplate} from "../../../../../../api/tv_fs/v1/fm_pb";
import {authProxy} from "../../../../../auth/store/store";

export const ProvideTemplateStoreProxy = proxy<ProvideTemplateStore>({
    ProvideTemplateEdit: {} as ProvideTemplate,
    ProvideTemplatelist: [],
    ProvideTemplateFilter: {} as ProvideTemplate,
    ProvideTemplatetableUrl: "",
});

export const useproxy_ProvideTemplateEdit = () => {
    var ProvideTemplatelistStore = useProxy(ProvideTemplateStoreProxy);
    console.info(
        "调用useProvideTemplatelistRows,返回Rows列表:",
        ProvideTemplatelistStore.ProvideTemplateEdit,
    );
    return ProvideTemplatelistStore.ProvideTemplateEdit;
};
export const useproxy_ProvideTemplateFilter = () => {
    var ProvideTemplatelistStore = useProxy(ProvideTemplateStoreProxy);
    console.info(
        "调用useProvideTemplatelistRows,返回Rows列表:",
        ProvideTemplatelistStore.ProvideTemplateFilter,
    );
    return ProvideTemplatelistStore.ProvideTemplateFilter;
};
export const useproxy_ProvideTemplatetableUrl = () => {
    var ProvideTemplatelistStore = useProxy(ProvideTemplateStoreProxy);
    console.info(
        "调用useProvideTemplatelistRows,返回Rows列表:",
        ProvideTemplatelistStore.ProvideTemplatetableUrl,
    );
    return ProvideTemplatelistStore.ProvideTemplatetableUrl;
};
export const initialProvideTemplateParams: ProvideTemplate = {
    id: 0,
    distributorId: "",
    modelId: "",
    aliasName: "",
    descriptionStore: "",
    descriptionAddPic: "",
    distributorName: "",
    modelName: "",
};
export const pre_ProvideTemplatelistLoader = async () => {
    var permissions = authProxy.permissions;
    var ProvideTemplateTable = permissions.find(
        (option) => option.name === "查看所属型号",
    );
    ProvideTemplateStoreProxy.ProvideTemplatetableUrl = `${ProvideTemplateTable?.url}/${ProvideTemplateTable?.id}`;
    return true;
};
export const pre_ProvideTemplatelistLoaderForNotification = async () => {
    var permissions = authProxy.permissions;
    var ProvideTemplateTable = permissions.find(
        (option) => option.name === "查看消息通知所属型号",
    );
    ProvideTemplateStoreProxy.ProvideTemplatetableUrl = `${ProvideTemplateTable?.url}/${ProvideTemplateTable?.id}`;
    return true;
};
export const pre_ProvideTemplatelistLoaderForMarketApk = async () => {
    var permissions = authProxy.permissions;
    var ProvideTemplateTable = permissions.find(
        (option) => option.name === "查看Apk所属型号",
    );
    ProvideTemplateStoreProxy.ProvideTemplatetableUrl = `${ProvideTemplateTable?.url}/${ProvideTemplateTable?.id}`;
    return true;
};
export const pre_ProvideTemplatelistLoaderForMarketImage = async () => {
    var permissions = authProxy.permissions;
    var ProvideTemplateTable = permissions.find(
        (option) => option.name === "查看市场图片所属型号",
    );
    ProvideTemplateStoreProxy.ProvideTemplatetableUrl = `${ProvideTemplateTable?.url}/${ProvideTemplateTable?.id}`;
    return true;
};
export const pre_ProvideTemplatelistLoaderMovaRecommend = async () => {
    var permissions = authProxy.permissions;
    var ProvideTemplateTable = permissions.find(
        (option) => option.name === "查看分销商推荐APK所属型号",
    );
    ProvideTemplateStoreProxy.ProvideTemplatetableUrl = `${ProvideTemplateTable?.url}/${ProvideTemplateTable?.id}`;
    return true;
};
export const pre_ProvideTemplatelistLoaderVod = async () => {
    var permissions = authProxy.permissions;
    var ProvideTemplateTable = permissions.find(
        (option) => option.name === "查看分销商视频点播所属型号",
    );
    ProvideTemplateStoreProxy.ProvideTemplatetableUrl = `${ProvideTemplateTable?.url}/${ProvideTemplateTable?.id}`;
    return true;
};
