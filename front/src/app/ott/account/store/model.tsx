import {AccountFilter, AccountInfo, LotLabel,} from "../../../../api/asm/v1/asm_pb";

export type AccountStore = {
    AccountEdit: AccountInfo;
    Accountlist: [];
    AccountFilter: AccountFilter;
    AccounttableUrl: string;
    lotList: LotLabel[];
};
