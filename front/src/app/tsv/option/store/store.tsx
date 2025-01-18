import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {ClassInfoStore} from "./model";
import {ClassInfo} from "../../../../api/ta/v1/tam_pb";
import {DistributorInputStoreProxy} from "../../../../const/distributortomodel/store/store";
import {grpcAllDistributor} from "../../../distributor/api/grpcAllDistributor";
import {DistributorTreeStoreProxy} from "../../../distributor/store/store";

export const ClassInfoStoreproxy = proxy<ClassInfoStore>({
    ClassInfoEdit: {} as ClassInfo,
    ClassInfolist: [],
    ClassInfoFilter: {} as ClassInfo,
    ClassInfotableUrl: "",
});

export const useproxy_ClassInfoEdit = () => {
    var ClassInfoStore = useProxy(ClassInfoStoreproxy);
    console.info(
        "调用useClassInfoRows,返回Rows列表:",
        ClassInfoStore.ClassInfoEdit,
    );
    return ClassInfoStore.ClassInfoEdit;
};
export const useproxy_ClassInfoFilter = () => {
    var ClassInfoStore = useProxy(ClassInfoStoreproxy);
    console.info(
        "调用useClassInfoRows,返回Rows列表:",
        ClassInfoStore.ClassInfoFilter,
    );
    return ClassInfoStore.ClassInfoFilter;
};
export const useproxy_ClassInfoUrl = () => {
    var ClassInfoStore = useProxy(ClassInfoStoreproxy);
    console.info(
        "调用useClassInfoRows,返回Rows列表:",
        ClassInfoStore.ClassInfotableUrl,
    );
    return ClassInfoStore.ClassInfotableUrl;
};
export const initialClassInfoParams: ClassInfo = {
    id: 0,
    name: "",
    zhName: "",
    sort: 0,
    topTitle: "",
    middleTitle: "",
    bottomTitle: "",
};

export const pre_ClassInfoLoader = async () => {
    var permissions = authProxy.permissions;
    var res = await grpcAllDistributor();
    DistributorTreeStoreProxy.AllDistributor = res.tree;
    var ClassInfoTable = permissions.find((option) => option.name === "查看选项");
    DistributorInputStoreProxy.DistributorValue = "";
    DistributorInputStoreProxy.ModelValue = "";
    ClassInfoStoreproxy.ClassInfotableUrl = `${ClassInfoTable?.url}/${ClassInfoTable?.id}`;
    return true;
};
