import {AdvertisementPicture, DistributorLabel, ModelLabel,} from "../../../../api/fs/v1/fm_pb";

export type TVDesktopStore = {
    TVDesktopImageEdit: AdvertisementPicture;
    TVDesktopImageList: AdvertisementPicture[];
    IsBackgroundFileUpload: boolean;
    TVDesktopImageUrl: string;
    distributor: DistributorLabel;
    model: ModelLabel;
    TVDesktopImageFilter: AdvertisementPicture;
};
export type D2M = {
    distributorId: string;
    modelId: string;
};
