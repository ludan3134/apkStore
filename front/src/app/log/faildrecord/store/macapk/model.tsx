import {MacApk} from "../../../../../api/ax/v1/axm_pb";

export type MacApkStore = {
    MacApkEdit: MacApk;
    MacApklist: [];
    MacApkFilter: MacApk;
    MacApktableUrl: string;
};


export type MacApkBulkImport = {
    distributor_id: string;
    lot_id: string;
    set_active: boolean;
    set_service: boolean;
};

