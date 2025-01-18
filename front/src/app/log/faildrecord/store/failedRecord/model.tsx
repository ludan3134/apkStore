import {FailedRecord} from "../../../../../api/ax/v1/axm_pb";

export type FailedRecordStore = {
    FailedRecordEdit: FailedRecord;
    FailedRecordlist: [];
    FailedRecordFilter: FailedRecord;
    FailedRecordtableUrl: string;
};


export type FailedRecordBulkImport = {
    distributor_id: string;
    lot_id: string;
    set_active: boolean;
    set_service: boolean;
};

