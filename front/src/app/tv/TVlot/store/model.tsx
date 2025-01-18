import {Lot} from "../../../../api/asm/v1/asm_pb";

export type TVLotStore = {
    TVLotEdit: Lot;
    TVLotlist: Lot[];
    TVLotFilter: Lot;
    TVLottableUrl: string;
};
