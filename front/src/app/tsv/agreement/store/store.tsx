import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {AgreementStore} from "./model";
import {Agreement} from "../../../../api/ta/v1/tam_pb";
import {grpcAllDistributor} from "../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../distributor/store/store";
import {grpcAllModel} from "../../../model/api/grpcAllModel";
import {ModelStoreProxy} from "../../../model/store/store";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";

export const AgreementStoreproxy = proxy<AgreementStore>({
    AgreementEdit: {} as Agreement,
    Agreementlist: [],
    AgreementFilter: {} as Agreement,
    AgreementtableUrl: "",
    AgreementText: "",
});

export const useproxy_AgreementEdit = () => {
    var AgreementStore = useProxy(AgreementStoreproxy);
    console.info(
        "调用useAgreementRows,返回Rows列表:",
        AgreementStore.AgreementEdit,
    );
    return AgreementStore.AgreementEdit;
};
export const useproxy_AgreementFilter = () => {
    var AgreementStore = useProxy(AgreementStoreproxy);
    console.info(
        "调用useAgreementRows,返回Rows列表:",
        AgreementStore.AgreementFilter,
    );
    return AgreementStore.AgreementFilter;
};
export const useproxy_AgreementUrl = () => {
    var AgreementStore = useProxy(AgreementStoreproxy);
    console.info(
        "调用useAgreementRows,返回Rows列表:",
        AgreementStore.AgreementtableUrl,
    );
    return AgreementStore.AgreementtableUrl;
};
export const initialAgreementParams: Agreement = {
    id: 0,
    title: "",
    content: "",
    type: 0,
    lang: "",
    isUse: false,
};

export const pre_AgreementLoader = async () => {
    var permissions = authProxy.permissions;
    var AgreementTable = permissions.find((option) => option.name === "查看协议");
    var res = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = res.tree;
    var res1 = await grpcAllModel();
    ModelStoreProxy.AllModel = res1.tree;
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    AgreementStoreproxy.AgreementtableUrl = `${AgreementTable?.url}/${AgreementTable?.id}`;
    return true;
};
