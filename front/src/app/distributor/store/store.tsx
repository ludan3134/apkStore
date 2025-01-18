import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {DistributorTreeStore} from "./model";
import {TreeNode} from "../../../api/ax/v1/axm_pb";
import {authProxy} from "../../auth/store/store";
import {grpcAllDistributor} from "../api/grpcAllDistributor";
import {grpcAllModel} from "../../model/api/grpcAllModel";
import {ModelStoreProxy} from "../../model/store/store";

export const DistributorTreeStoreProxy = proxy<DistributorTreeStore>({
    AllDistributor: [] as TreeNode[],
    IsUserChange: false,
});

export const useproxy_AllDistributor = () => {
    var DistributorlistStore = useProxy(DistributorTreeStoreProxy);
    console.info(
        "调用useDistributorlistRows,返回Rows列表:",
        DistributorlistStore.AllDistributor,
    );
    return DistributorlistStore.AllDistributor;
};
export const useproxy_DistributorIsUserChange = () => {
    var DistributorlistStore = useProxy(DistributorTreeStoreProxy);
    console.info(
        "调用useDistributorlistRows,返回Rows列表:",
        DistributorlistStore.IsUserChange,
    );
    return DistributorlistStore.IsUserChange;
};
export const pre_DistributorlistLoader = async () => {
    var permissions = authProxy.permissions;
    var res = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = res.tree;

    var res1 = await grpcAllModel();
    ModelStoreProxy.AllModel = res1.tree;
    return true;
};
