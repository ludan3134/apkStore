import {Lot} from "../../../../api/asm/v1/asm_pb";

export type LotStore = {
    LotEdit: Lot;
    Lotlist: Lot[];
    LotFilter: Lot;
    LottableUrl: string;
};
