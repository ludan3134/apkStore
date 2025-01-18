import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {authProxy} from "../../../auth/store/store";
import {LanguageStore} from "./model";
import {Region} from "../../../../api/ta/v1/tam_pb";

export const LanguageStoreproxy = proxy<LanguageStore>({
    LanguageEdit: {} as Region,
    Languagelist: [],
    LanguageFilter: {} as Region,
    LanguagetableUrl: "",
});

export const useproxy_LanguageEdit = () => {
    var RegionStore = useProxy(LanguageStoreproxy);
    console.info("调用useRegionRows,返回Rows列表:", RegionStore.LanguageEdit);
    return RegionStore.LanguageEdit;
};
export const useproxy_LanguageFilter = () => {
    var RegionStore = useProxy(LanguageStoreproxy);
    console.info("调用useRegionRows,返回Rows列表:", RegionStore.LanguageFilter);
    return RegionStore.LanguageFilter;
};
export const useproxy_LanguageUrl = () => {
    var RegionStore = useProxy(LanguageStoreproxy);
    console.info("调用useRegionRows,返回Rows列表:", RegionStore.LanguagetableUrl);
    return RegionStore.LanguagetableUrl;
};
export const initialRegionParams: Region = {
    id: 0,
    name: "",
    zhName: "",
    code: "",
    language: "",
};

export const pre_LanguageLoader = async () => {
    var permissions = authProxy.permissions;
    var RegionTable = permissions.find(
        (option) => option.name === "查找直播地址",
    );
    LanguageStoreproxy.LanguagetableUrl = `${RegionTable?.url}/${RegionTable?.id}`;
    return true;
};
