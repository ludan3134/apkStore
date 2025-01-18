import {Dayjs} from "dayjs";
import {MajorEvent} from "../../../../api/ks/v1/km_pb";
import {CommonMeta} from "../../../../api/com/v1/pagemeta_pb";

export type EventStore = {
    EventEdit: MajorEvent;
    Eventlist: MajorEvent[];
    EventFilter: CommonMeta;
    EventtableUrl: string;
};

export type EventTimeFilter = {
    startTime: Dayjs;
    endTime: Dayjs;
};
export type EventInsert = {
    title: string;
    liveMatch: string;
    matchData: string;
    timezone: string;
    baseTime: Dayjs;
    ateam: string;
    ateamIcon: string;
    bteam: string;
    bteamIcon: string;
};
export type EventEdit = {
    id: number;
    title: string;
    liveMatch: string;
    matchData: string;
    timezone: string;
    baseTime: Dayjs;
    ateam: string;
    ateamIcon: string;
    bteam: string;
    bteamIcon: string;
};
