import {Dayjs} from "dayjs";

export type ChartFilter = {
    distributorId: string,
    modelId: string,
    startTime: Dayjs;
    endTime: Dayjs;
};
export type ChartStore = {
    chartFilter: ChartFilter;
};
