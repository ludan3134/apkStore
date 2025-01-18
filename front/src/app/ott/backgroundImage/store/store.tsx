import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {BackgroundlStore} from "./model";
import {DistributorLabel, HomeBackgroundImage, ModelLabel,} from "../../../../api/fs/v1/fm_pb";
import {grpcAllDistributor} from "../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../distributor/store/store";
import {ModelStoreProxy} from "../../../model/store/store";
import {grpcAllModel} from "../../../model/api/grpcAllModel";
import {authProxy} from "../../../auth/store/store";

export const BackgroundStoreProxy = proxy<BackgroundlStore>({
    BackgroundlEdit: {} as HomeBackgroundImage,
    BackgroundlList: [] as HomeBackgroundImage[],
    IsBackgroundFileUpload: false,
    distributor: {} as DistributorLabel,
    model: {} as ModelLabel,
    BackgroundtableUrl: "",
    BackgroundFilter: {} as HomeBackgroundImage,
});

export const useproxy_BackgroundEdit = () => {
    var BackgroundlistStore = useProxy(BackgroundStoreProxy);
    console.info(
        "调用useBackgroundlistRows,返回Rows列表:",
        BackgroundlistStore.BackgroundlEdit,
    );
    return BackgroundlistStore.BackgroundlEdit;
};

export const useproxy_BackgroundtableUrl = () => {
    var BackgroundlistStore = useProxy(BackgroundStoreProxy);
    console.info(
        "调用useBackgroundlistRows,返回Rows列表:",
        BackgroundlistStore.BackgroundtableUrl,
    );
    return BackgroundlistStore.BackgroundtableUrl;
};
export const useproxy_Backgrounddistributor = () => {
    var BackgroundlistStore = useProxy(BackgroundStoreProxy);
    console.info(
        "调用useBackgroundlistRows,返回Rows列表:",
        BackgroundlistStore.distributor,
    );
    return BackgroundlistStore.distributor;
};
export const useproxy_Backgroundmodel = () => {
    var BackgroundlistStore = useProxy(BackgroundStoreProxy);
    console.info(
        "调用useBackgroundlistRows,返回Rows列表:",
        BackgroundlistStore.model,
    );
    return BackgroundlistStore.model;
};
export const useproxy_BackgroundFilter = () => {
    var BackgroundlistStore = useProxy(BackgroundStoreProxy);
    console.info(
        "调用useBackgroundlistRows,返回Rows列表:",
        BackgroundlistStore.model,
    );
    return BackgroundlistStore.BackgroundFilter;
};
export const pre_BackgroundlistLoader = async () => {
    var distributores = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = distributores.tree;
    var modelres = await grpcAllModel();
    ModelStoreProxy.AllModel = modelres.tree;
    var permissions = authProxy.permissions;
    var BackgroundeTable = permissions.find((option) => option.name === "查看背景图片");
    BackgroundStoreProxy.BackgroundtableUrl = `${BackgroundeTable?.url}/${BackgroundeTable?.id}`;
    // grpcDistributorLot()
    return true;
};

export const initialBackgroundfilterParams: HomeBackgroundImage = {
    id: "",
    version: "",
    md5: "",
    url: "",
    content: "",
    distributorId: "",
    modelId: "",
    isUse: false,
};
