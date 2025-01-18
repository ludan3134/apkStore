import {TerminalFilter, TerminalInfo} from "../../../../api/asm/v1/asm_pb";

export type TVTerminalStore = {
    TVTerminalEdit: TerminalInfo;
    TVTerminallist: [];
    TVTerminalFilter: TerminalFilter;
    TVTerminaltableUrl: string;
};
export type TVTerminalBulkImport = {
    distributor_id: string;
    lot_id: string;
    model_id: string;
    set_active: boolean;
    set_service: boolean;
    storeAuth: boolean;
};
