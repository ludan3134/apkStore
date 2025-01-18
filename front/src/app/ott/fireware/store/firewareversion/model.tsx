import {FirmwareDetail} from "../../../../../api/fs/v1/fm_pb";

export type FirewaredetailStore = {
    FirewaredetailEdit: FirmwareDetail;
    FirewaredetailList: FirmwareDetail[];
    IsFirewareFileUpload: boolean;
    FirewareversiontableUrl: string;
};
