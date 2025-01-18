import {proxy} from "valtio";
import {useProxy} from "valtio/utils";
import {VodLinkStore} from "./model";
import {VodLink} from "../../../../../api/ks/v1/km_pb";


export const VodLinkStoreproxy = proxy<VodLinkStore>({
    VodLinkEdit: {} as VodLink,
    VodLinklist: [],
    VodLinkFilter: {} as VodLink,
    VodLinktableUrl: [] as string[],

});

export const useproxy_VodLinkEdit = () => {
    var VodLinkStore = useProxy(VodLinkStoreproxy);
    console.info(
        "调用useVodLinkRows,返回Rows列表:",
        VodLinkStore.VodLinkEdit,
    );
    return VodLinkStore.VodLinkEdit;
};
export const useproxy_VodLinkFilter = () => {
    var VodLinkStore = useProxy(VodLinkStoreproxy);
    console.info(
        "调用useVodLinkRows,返回Rows列表:",
        VodLinkStore.VodLinkFilter,
    );
    return VodLinkStore.VodLinkFilter;
};
export const useproxy_VodLinkUrl = () => {
    var VodLinkStore = useProxy(VodLinkStoreproxy);
    console.info(
        "调用useVodLinkRows,返回Rows列表:",
        VodLinkStore.VodLinktableUrl,
    );
    return VodLinkStore.VodLinktableUrl;
};
// export const useproxy_VodLinkAllOption = () => {
//     var VodLinkStore = useProxy(VodLinkStoreproxy);
//     console.info(
//         "调用useVodLinkRows,返回Rows列表:",
//         VodLinkStore.AllOption,
//     );
//     return VodLinkStore.AllOption;
// };
// export const useproxy_VodLinkAllCategory = () => {
//     var VodLinkStore = useProxy(VodLinkStoreproxy);
//     console.info(
//         "调用useVodLinkRows,返回Rows列表:",
//         VodLinkStore.AllCategory,
//     );
//     return VodLinkStore.AllCategory;
// };
export const initialVodLinkParams: VodLink = {};

