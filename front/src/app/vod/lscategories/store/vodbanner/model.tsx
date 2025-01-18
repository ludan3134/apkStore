import {VodBanner} from "../../../../../api/ks/v1/km_pb";

export type VodBannerStore = {
    VodBannerEdit: VodBanner;
    VodBannerlist: VodBanner[];
    VodBannerFilter: VodBanner;
    VodBannertableUrl: string;
};
