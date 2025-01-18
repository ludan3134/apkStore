import {DistributorLabel, HomeBackgroundImage, ModelLabel,} from "../../../../api/fs/v1/fm_pb";

export type BackgroundlStore = {
    BackgroundlEdit: HomeBackgroundImage;
    BackgroundlList: HomeBackgroundImage[];
    IsBackgroundFileUpload: boolean;
    BackgroundtableUrl: string;
    distributor: DistributorLabel;
    model: ModelLabel;
    BackgroundFilter: HomeBackgroundImage;
};
export type D2M = {
    distributorId: string;
    modelId: string;
};
