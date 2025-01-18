import {DistributorLabel, HomeBackgroundImage, ModelLabel,} from "../../../../api/fs/v1/fm_pb";

export type TVBackgroundlStore = {
    TVBackgroundlEdit: HomeBackgroundImage;
    TVBackgroundlList: HomeBackgroundImage[];
    IsTVBackgroundFileUpload: boolean;
    TVBackgroundtableUrl: string;
    distributor: DistributorLabel;
    model: ModelLabel;
    TVBackgroundFilter: HomeBackgroundImage;
};
export type D2M = {
    distributorId: string;
    modelId: string;
};
