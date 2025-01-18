import {Epg} from "../../../../api/ks/v1/km_pb";

export type EpgStore = {
    EpgEdit: Epg;
    Epglist: Epg[];
    EpgFilter: Epg;
    EpgtableUrl: string;
};
