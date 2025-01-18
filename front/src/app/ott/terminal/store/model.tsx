import {TerminalFilter, TerminalInfo} from "../../../../api/asm/v1/asm_pb";

export type TerminalStore = {
    TerminalEdit: TerminalInfo;
    Terminallist: [];
    TerminalFilter: TerminalFilter;
    TerminaltableUrl: string;
};
export type TerminalBulkImport = {
    distributor_id: string;
    lot_id: string;
    model_id: string;
    set_active: boolean;
    set_service: boolean;
    storeAuth: boolean;
};
