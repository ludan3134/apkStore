import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {ModelStore} from "./model";
import {TreeNode} from "../../../api/ax/v1/axm_pb";
import {grpcAllModel} from "../api/grpcAllModel";
import {authProxy} from "../../auth/store/store";

export const ModelStoreProxy = proxy<ModelStore>({
    AllModel: [] as TreeNode[],
});

export const useproxy_AllModel = () => {
    var DistributorlistStore = useProxy(ModelStoreProxy);
    console.info(
        "调用useDistributorlistRows,返回Rows列表:",
        DistributorlistStore.AllModel,
    );
    return DistributorlistStore.AllModel;
};
export const pre_ModellistLoader = async () => {
    var permissions = authProxy.permissions;
    var res = await grpcAllModel();
    ModelStoreProxy.AllModel = res.tree;
    return true;
};
