import {Firmware} from "../../../../../api/fs/v1/fm_pb";

export type TVFirewareStore = {
    TVFirewareEdit: Firmware;
    TVFirewarelist: [];
    TVFirewareFilter: Firmware;
    TVFirewaretableUrl: string;
};
