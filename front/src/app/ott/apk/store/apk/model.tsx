import {Apk, ApkFilter} from "../../../../../api/fs/v1/fm_pb";

export type ApkStore = {
    ApkEdit: Apk;
    Apklist: [];
    ApkFilter: ApkFilter;
    ApktableUrl: string;
    ApkCopy: Apk[];
};

export type ApkCopyStore = {
    distributorId: string;
    modelId: string[];
};
