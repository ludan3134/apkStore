import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {DistributorDetailStore} from "./model";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";
import {authProxy} from "../../../auth/store/store";
import {DistributorDetail} from "../../../../api/fs/v1/fm_pb";

export const DistributorDetailStoreProxy = proxy<DistributorDetailStore>({
    DistributorDetailEdit: {} as DistributorDetail,
    DistributorDetailList: [] as DistributorDetail[],
    DistributorDetailUrl: "",
    DistributorDetailFilter: {} as DistributorDetail,
});

export const useproxy_DistributorDetailEdit = () => {
    var DistributorDetaillistStore = useProxy(DistributorDetailStoreProxy);
    console.info(
        "调用useDistributorDetaillistRows,返回Rows列表:",
        DistributorDetaillistStore.DistributorDetailEdit,
    );
    return DistributorDetaillistStore.DistributorDetailEdit;
};

export const useproxy_DistributorDetailtableUrl = () => {
    var DistributorDetaillistStore = useProxy(DistributorDetailStoreProxy);
    console.info(
        "调用useDistributorDetaillistRows,返回Rows列表:",
        DistributorDetaillistStore.DistributorDetailUrl,
    );
    return DistributorDetaillistStore.DistributorDetailUrl;
};
export const useproxy_DistributorDetailsFilter = () => {
    var DistributorDetailslistStore = useProxy(DistributorDetailStoreProxy);
    console.info(
        "调用useDistributorDetailslistRows,返回Rows列表:",
        DistributorDetailslistStore.DistributorDetailFilter,
    );
    return DistributorDetailslistStore.DistributorDetailFilter;
};

export const pre_DistributorDetaillistLoader = async () => {
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    var permissions = authProxy.permissions;
    var ApkTable = permissions.find(
        (option) => option.name === "查看分销商账号信息",
    );
    DistributorDetailStoreProxy.DistributorDetailUrl = `${ApkTable?.url}/${ApkTable?.id}`;
    return true;
};

export const initialDistributorDetailfilterParams: DistributorDetail = {
    distributorId: "",
    modelId: "",
};
