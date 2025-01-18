import {AdvertisementPicture} from "../../../../api/fs/v1/fm_pb";
import {DistributorLabel, ModelLabel} from "../../../../api/ax/v1/axm_pb";

export type DesktopStore = {
    DesktopImageEdit: AdvertisementPicture;
    DesktopImageList: AdvertisementPicture[];
    IsBackgroundFileUpload: boolean;
    DesktopImageUrl: string;
    distributor: DistributorLabel;
    model: ModelLabel;
    DesktopImageFilter: AdvertisementPicture;
};
export type D2M = {
    distributorId: string;
    modelId: string;
};
