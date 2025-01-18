import {proxy} from "valtio";
import {TreeNode} from "../../../api/ax/v1/axm_pb";
import {DistributorInputStore} from "./model";
import {useProxy} from "valtio/utils";

export const DistributorInputStoreProxy = proxy<DistributorInputStore>({
    DistributorInput: [] as TreeNode[],
    DistributorValue: "",
    ModelValue: "",
});

export const useproxy_DistributorInput = () => {
    var DistributorlistStore = useProxy(DistributorInputStoreProxy);
    console.info(
        "调用useDistributorlistRows,返回Rows列表:",
        DistributorlistStore.DistributorInput,
    );
    return DistributorlistStore.DistributorInput;
};
export const useproxy_DistributorValue = () => {
    var DistributorlistStore = useProxy(DistributorInputStoreProxy);
    console.info(
        "调用useDistributorlistRows,返回Rows列表:",
        DistributorlistStore.DistributorValue,
    );
    return DistributorlistStore.DistributorValue;
};
export const useproxy_ModelValue = () => {
    var DistributorlistStore = useProxy(DistributorInputStoreProxy);
    console.info(
        "调用useDistributorlistRows,返回Rows列表:",
        DistributorlistStore.ModelValue,
    );
    return DistributorlistStore.ModelValue;
};
