import {ApkDetail} from "../../../../../api/fs/v1/fm_pb";

export type ApkdetailStore = {
    ApkdetailEdit: ApkDetail;
    ApkdetailList: ApkDetail[];
    IsApkFileUpload: boolean;
    ApkversiontableUrl: string;
};
