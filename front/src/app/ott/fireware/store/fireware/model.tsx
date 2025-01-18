import {Firmware} from "../../../../../api/fs/v1/fm_pb";

export type FirewareStore = {
    FirewareEdit: Firmware;
    Firewarelist: [];
    FirewareFilter: Firmware;
    FirewaretableUrl: string;
};
