import {Apk, ApkFilter} from "../../../../../api/fs/v1/fm_pb";

export type TVApkStore = {
    TVApkEdit: Apk;
    TVApklist: [];
    TVApkFilter: ApkFilter;
    TVApktableUrl: string;
    TVApkCopy: Apk[];
};

export type TVApkCopyStore = {
    distributorId: string;
    modelId: string[];
};
