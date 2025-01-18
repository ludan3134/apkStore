import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {TVBackgroundlStore} from "./model";
import {grpcAllDistributor} from "../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../distributor/store/store";
import {grpcAllModel} from "../../../model/api/grpcAllModel";
import {ModelStoreProxy} from "../../../model/store/store";
import {DistributorLabel, ModelLabel} from "../../../../api/ax/v1/axm_pb";
import {HomeBackgroundImage} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";

export const TVBackgroundStoreProxy = proxy<TVBackgroundlStore>({
    TVBackgroundlEdit: {} as HomeBackgroundImage,
    TVBackgroundlList: [] as HomeBackgroundImage[],
    IsTVBackgroundFileUpload: false,
    distributor: {} as DistributorLabel,
    model: {} as ModelLabel,
    TVBackgroundtableUrl: "",
    TVBackgroundFilter: {} as HomeBackgroundImage,
});

export const useproxy_TVBackgroundEdit = () => {
    var TVBackgroundlistv_tv_fstore = useProxy(TVBackgroundStoreProxy);
    console.info(
        "调用useTVBackgroundlistRows,返回Rows列表:",
        TVBackgroundlistv_tv_fstore.TVBackgroundlEdit,
    );
    return TVBackgroundlistv_tv_fstore.TVBackgroundlEdit;
};

export const useproxy_TVBackgroundtableUrl = () => {
    var TVBackgroundlistv_tv_fstore = useProxy(TVBackgroundStoreProxy);
    console.info(
        "调用useTVBackgroundlistRows,返回Rows列表:",
        TVBackgroundlistv_tv_fstore.TVBackgroundtableUrl,
    );
    return TVBackgroundlistv_tv_fstore.TVBackgroundtableUrl;
};
export const useproxy_TVBackgrounddistributor = () => {
    var TVBackgroundlistv_tv_fstore = useProxy(TVBackgroundStoreProxy);
    console.info(
        "调用useTVBackgroundlistRows,返回Rows列表:",
        TVBackgroundlistv_tv_fstore.distributor,
    );
    return TVBackgroundlistv_tv_fstore.distributor;
};
export const useproxy_TVBackgroundmodel = () => {
    var TVBackgroundlistv_tv_fstore = useProxy(TVBackgroundStoreProxy);
    console.info(
        "调用useTVBackgroundlistRows,返回Rows列表:",
        TVBackgroundlistv_tv_fstore.model,
    );
    return TVBackgroundlistv_tv_fstore.model;
};
export const useproxy_TVBackgroundFilter = () => {
    var TVBackgroundlistv_tv_fstore = useProxy(TVBackgroundStoreProxy);
    console.info(
        "调用useTVBackgroundlistRows,返回Rows列表:",
        TVBackgroundlistv_tv_fstore.model,
    );
    return TVBackgroundlistv_tv_fstore.TVBackgroundFilter;
};
export const pre_TVBackgroundlistLoader = async () => {
    var distributores = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = distributores.tree;
    var modelres = await grpcAllModel();
    ModelStoreProxy.AllModel = modelres.tree;

    var permissions = authProxy.permissions;
    var BackgroundeTable = permissions.find((option) => option.name === "查看电视背景图片");
    TVBackgroundStoreProxy.TVBackgroundtableUrl = `${BackgroundeTable?.url}/${BackgroundeTable?.id}`;

    // grpcDistributorLot()
    return true;
};

export const initialTVBackgroundfilterParams: HomeBackgroundImage = {
    id: "",
    version: "",
    md5: "",
    url: "",
    content: "",
    distributorId: "",
    modelId: "",
    isUse: false,
};
