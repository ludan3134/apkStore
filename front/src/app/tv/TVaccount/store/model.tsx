import {AccountFilter, AccountInfo, LotLabel,} from "../../../../api/tv_asm/v1/asm_pb";

export type TVAccountStore = {
    TVAccountEdit: AccountInfo;
    TVAccountlist: [];
    TVAccountFilter: AccountFilter;
    TVAccounttableUrl: string;
    lotList: LotLabel[];
};
