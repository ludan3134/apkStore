import {FirmwareDetail} from "../../../../../api/fs/v1/fm_pb";

export type TVFirewaredetailStore = {
    TVFirewaredetailEdit: FirmwareDetail;
    TVFirewaredetailList: FirmwareDetail[];
    IsTVFirewareFileUpload: boolean;
    TVFirewareversiontableUrl: string;
};
