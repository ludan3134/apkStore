import {MacAccount} from "../../../../api/ks/v1/km_pb";

export type XCACCountStore = {
    XCACCountEdit: MacAccount;
    XCACCountlist: MacAccount[];
    XCACCountFilter: MacAccount;
    XCACCounttableUrl: string;
};
export type AccountBulkImport = {
    combo_id: string;
    platform_type: string;
    duration: string;
    app_id:string
};
